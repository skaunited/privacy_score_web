import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { MANIFEST_FILE, submitDeployed } from './indexnow.mjs';

const args = process.argv.slice(2);
const checkOnly = args.includes('--check-only');
const requireSubmission = args.includes('--require-submission');
const positional = args.filter((arg) => !arg.startsWith('--'));
if (positional.length > 1 || args.some((arg) => arg.startsWith('--') && !['--check-only', '--require-submission'].includes(arg))
  || (checkOnly && requireSubmission)) throw new Error('Usage: submit-indexnow.mjs [build] [--check-only | --require-submission]');
const build = resolve(positional[0] ?? 'dist');
const statePath = resolve('.indexnow/state.json');
const reportPath = resolve(`reports/indexnow/${checkOnly ? 'check' : 'result'}.json`);
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
  return submitDeployed({ manifest, state, checkOnly });
}
try {
  const result = await run();
  // A green submission job must mean an actual non-empty API receipt. If the
  // deployment changes between jobs, report the race instead of a green zero.
  if (requireSubmission && (result.report.status !== 'submitted' || !result.report.submittedUrls.length))
    throw new Error(`No submission attempted: ${result.report.reason ?? result.report.status}`);
  await writeFile(reportPath, `${JSON.stringify(result.report, null, 2)}\n`);
  if (result.state) {
    await mkdir(dirname(statePath), { recursive: true });
    await writeFile(`${statePath}.tmp`, `${JSON.stringify(result.state, null, 2)}\n`);
    await rename(`${statePath}.tmp`, statePath);
  }
  console.log(JSON.stringify(result.report, null, 2));
  if (process.env.GITHUB_OUTPUT)
    await appendFile(process.env.GITHUB_OUTPUT, `state_changed=${Boolean(result.state)}\nready_to_submit=${result.report.status === 'ready-to-submit'}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const title = {
      'pending-deployment': 'En attente de publication Plesk — aucune soumission tentée',
      unchanged: 'Contenu déjà soumis — aucun nouvel envoi',
      'ready-to-submit': 'Production vérifiée — soumission autorisée',
      submitted: `Soumission IndexNow reçue — HTTP ${result.report.responseStatus}`,
    }[result.report.status];
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `## ${title}\n\n`
      + (checkOnly ? '**Contrôle uniquement : aucun POST IndexNow effectué.**\n\n' : '')
      + `- État technique : \`${result.report.status}\`\n`
      + `- Checked: ${result.report.checkedAt}\n`
      + (checkOnly ? `- URLs à soumettre : ${result.report.plannedUrls?.length ?? 0}\n` : `- URLs envoyées : ${result.report.submittedUrls.length}\n`)
      + (result.report.responseStatus ? `- Receipt: HTTP ${result.report.responseStatus}${result.report.keyValidationPending ? ' (key validation pending)' : ''}\n` : '')
      + (result.report.reason ? `- ${result.report.reason}\n` : '')
      + (result.report.previousResponseStatus ? `- Dernier reçu enregistré : HTTP ${result.report.previousResponseStatus}, ${result.report.previousSubmittedAt}.\n` : '')
      + (checkOnly ? '- Ce contrôle ne produit aucun reçu de soumission.\n' : '- Un reçu de soumission ne confirme pas l’indexation. Vérifier Bing Webmaster Tools.\n'));
  }
} catch (error) {
  const report = { checkedAt: new Date().toISOString(), status: 'error', indexed: false, error: error.message };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.error(error.message);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `## IndexNow: error\n\n${error.message}\n\nNo successful receipt was recorded.\n`);
  process.exitCode = 1;
}
