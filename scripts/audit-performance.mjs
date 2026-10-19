import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveBuild } from './serve-build.mjs';
import { auditRuns, summarizeScenario } from './lighthouse-results.mjs';

const exec = promisify(execFile);
const output = resolve('reports/lighthouse');
await mkdir(output, { recursive: true });
const preview = await serveBuild();
const cli = fileURLToPath(
  new URL('../node_modules/lighthouse/cli/index.js', import.meta.url),
);
const results = [];
const failures = [];
let auditError;
try {
  // Sequential audits: concurrent browser runs distort CPU measurements.
  for (const language of ['en', 'fr']) {
    for (const device of ['mobile', 'desktop']) {
      const name = `${language}-${device}`;
      const reports = [];
      for (let run = 1; run <= auditRuns; run++) {
        const destination = resolve(output, `${name}-run-${run}`);
        const args = [
          cli,
          `${preview.url}${language === 'fr' ? '/fr/' : '/'}`,
          '--chrome-flags=--headless --disable-gpu',
          '--output=json',
          '--output=html',
          '--save-assets',
          `--output-path=${destination}`,
          '--quiet',
          ...(device === 'desktop' ? ['--preset=desktop'] : []),
        ];
        await exec(process.execPath, args, {
          timeout: 120000,
          maxBuffer: 2 * 1024 * 1024,
        });
        const report = JSON.parse(
          await readFile(`${destination}.report.json`, 'utf8'),
        );
        reports.push(report);
        console.log(
          JSON.stringify({
            name,
            run,
            performance: report.categories?.performance?.score,
            blockingTime: report.audits?.['total-blocking-time']?.numericValue,
            largestContentfulPaint:
              report.audits?.['largest-contentful-paint']?.numericValue,
            lcpElement: report.audits?.[
              'lcp-breakdown-insight'
            ]?.details?.items?.find((item) => item.type === 'node')?.selector,
          }),
        );
      }
      const result = summarizeScenario(name, reports);
      results.push(result);
      failures.push(...result.failures);
      console.log(JSON.stringify(result));
    }
  }
} catch (error) {
  auditError = error;
  failures.push(error.message);
} finally {
  await preview.close();
  await writeFile(
    resolve(output, 'summary.json'),
    JSON.stringify({ results, failures }, null, 2),
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = results.map(
      (result) =>
        `| ${result.name} | ${result.samples.map((sample) => Math.round(sample.scores.performance * 100)).join(' / ')} | ${Math.round(result.scores.performance * 100)} | ${Math.round(result.metrics['total-blocking-time'])} ms | ${result.failures.length ? 'Failed' : 'Passed'} |`,
    );
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      [
        '## Lighthouse — three cold-browser runs per scenario',
        '',
        'Performance and timing thresholds use the median of all three runs. Accessibility, best practices, SEO and agent navigation must pass on every run. Thresholds remain 95/100 performance, 150 ms blocking and 0.02 CLS.',
        '',
        '| Scenario | All performance scores | Median score | Median blocking | Result |',
        '| --- | --- | --- | --- | --- |',
        ...rows,
        '',
        'All raw reports, traces and browser logs are in the Lighthouse artifact.',
        ...(failures.length
          ? ['', ...failures.map((message) => `- ${message}`)]
          : []),
        '',
      ].join('\n'),
    );
  }
}
if (auditError) throw auditError;
if (failures.length) throw new Error(failures.join('\n'));
