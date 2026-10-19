import { mkdir, mkdtemp, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveBuild } from './serve-build.mjs';
import { auditRuns, summarizeScenario } from './lighthouse-results.mjs';
import { collectLighthouseSample } from './lighthouse-runner.mjs';

const output = resolve('reports/lighthouse');
await mkdir(output, { recursive: true });
// A fresh directory also prevents a failed process from reusing an older report.
const auditOutput = await mkdtemp(resolve(output, 'audit-'));
const preview = await serveBuild();
const cli = fileURLToPath(
  new URL('../node_modules/lighthouse/cli/index.js', import.meta.url),
);
const results = [];
const failures = [];
const attempts = [];
let auditError;
try {
  // Sequential audits: concurrent browser runs distort CPU measurements.
  for (const language of ['en', 'fr']) {
    for (const device of ['mobile', 'desktop']) {
      const name = `${language}-${device}`;
      const reports = [];
      for (let run = 1; run <= auditRuns; run++) {
        const sample = await collectLighthouseSample({
          cli, device, destination: resolve(auditOutput, `${name}-run-${run}`),
          url: `${preview.url}${language === 'fr' ? '/fr/' : '/'}`,
          onAttempt: (record) => {
            attempts.push({ name, run, ...record });
            if (record.status === 'error') console.warn(JSON.stringify({ name, run, ...record }));
          },
        });
        const { report } = sample;
        reports.push(report);
        console.log(
          JSON.stringify({
            name,
            run,
            attempts: sample.attempts.length,
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
    JSON.stringify({ results, failures, attempts }, null, 2),
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
        'Only invalid NO_NAVSTART trace recordings may be retried, at most twice per measurement. Complete scores and other failures are never retried.',
        '',
        '| Scenario | All performance scores | Median score | Median blocking | Result |',
        '| --- | --- | --- | --- | --- |',
        ...rows,
        '',
        'All raw reports, traces and browser logs are in the Lighthouse artifact.',
        '',
        ...attempts.filter((attempt) => attempt.status === 'error').map((attempt) =>
          `- ${attempt.name} run ${attempt.run}, attempt ${attempt.attempt}: ${attempt.runtimeCode ?? 'audit failure'}${attempt.retry ? ' — retried with a fresh browser' : ' — failed'}.`,
        ),
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
