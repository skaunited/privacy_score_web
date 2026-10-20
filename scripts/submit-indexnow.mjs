import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { MANIFEST_FILE, submitDeployed } from './indexnow.mjs';

const build = resolve(process.argv[2] ?? 'dist');
const statePath = resolve('.indexnow/state.json');
const reportPath = resolve('reports/indexnow/result.json');
await mkdir(dirname(reportPath), { recursive: true });
async function run() {
  let manifest;
  try { manifest = JSON.parse(await readFile(join(build, MANIFEST_FILE), 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { report: { checkedAt: new Date().toISOString(), status: 'pending-deployment', indexed: false,
      submittedUrls: [], checks: [], reason: 'The deploy branch does not contain the IndexNow build manifest yet.' } };
  }
  let state;
  try { state = JSON.parse(await readFile(statePath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  return submitDeployed({ manifest, state });
}
try {
  const result = await run();
  await writeFile(reportPath, `${JSON.stringify(result.report, null, 2)}\n`);
  if (result.state) {
    await mkdir(dirname(statePath), { recursive: true });
    await writeFile(`${statePath}.tmp`, `${JSON.stringify(result.state, null, 2)}\n`);
    await rename(`${statePath}.tmp`, statePath);
  }
  console.log(JSON.stringify(result.report, null, 2));
  if (process.env.GITHUB_OUTPUT)
    await appendFile(process.env.GITHUB_OUTPUT, `state_changed=${Boolean(result.state)}\n`);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `## IndexNow: ${result.report.status}\n\n`
      + `- Checked: ${result.report.checkedAt}\n- URLs sent: ${result.report.submittedUrls.length}\n`
      + (result.report.responseStatus ? `- Receipt: HTTP ${result.report.responseStatus}${result.report.keyValidationPending ? ' (key validation pending)' : ''}\n` : '')
      + (result.report.reason ? `- ${result.report.reason}\n` : '')
      + '- This is a submission receipt, not confirmation of indexing. Check Bing Webmaster Tools.\n');
} catch (error) {
  const report = { checkedAt: new Date().toISOString(), status: 'error', indexed: false, error: error.message };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.error(error.message);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `## IndexNow: error\n\n${error.message}\n\nNo successful receipt was recorded.\n`);
  process.exitCode = 1;
}
