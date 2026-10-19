import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

const exec = promisify(execFile);
const maxTraceAttempts = 3;

// Match the Lighthouse CLI's runtime diagnostic, never a URL or arbitrary error message.
const noNavstartDiagnostic = /(?:^|\n)Runtime error encountered:[^\r\n]*\(NO_NAVSTART\)\s*$/;

export async function collectLighthouseSample({
  cli, url, device, destination, execute = exec, wait = delay, onAttempt = () => {},
}) {
  const attempts = [];
  for (let attempt = 1; attempt <= maxTraceAttempts; attempt++) {
    const path = attempt === 1 ? destination : `${destination}-attempt-${attempt}`;
    const reportPath = `${path}.report.json`;
    const args = [
      cli, url,
      '--chrome-flags=--headless --disable-gpu',
      '--output=json', '--output=html', '--save-assets',
      `--output-path=${path}`, '--quiet',
      ...(device === 'desktop' ? ['--preset=desktop'] : []),
    ];
    let processError;
    let processOutput;
    try {
      // Every invocation launches its own Chrome and uses Lighthouse's default cache reset.
      processOutput = await execute(process.execPath, args, {
        timeout: 120000, maxBuffer: 2 * 1024 * 1024,
      });
    } catch (error) {
      processError = error;
    }

    let report;
    let reportError;
    try {
      report = JSON.parse(await readFile(reportPath, 'utf8'));
    } catch (error) {
      reportError = error;
    }
    // The structured runtime code wins over stderr if Lighthouse produced a report.
    const runtimeCode = report?.runtimeError?.code ?? (
      processError && !report && noNavstartDiagnostic.test(processError.stderr ?? '')
        ? 'NO_NAVSTART' : undefined
    );
    const runtimeExit = !processError || (
      processError.code === 1 && !processError.killed && !processError.signal
    );
    const retry = runtimeExit && runtimeCode === 'NO_NAVSTART' && attempt < maxTraceAttempts;
    const record = {
      attempt, reportPath, runtimeCode, retry,
      status: processError || reportError || report?.runtimeError ? 'error' : 'complete',
    };
    attempts.push(record);
    await writeFile(`${path}.process.json`, JSON.stringify({
      ...record,
      stdout: processOutput?.stdout ?? processError?.stdout ?? '',
      stderr: processOutput?.stderr ?? processError?.stderr ?? '',
      processError: processError && {
        message: processError.message, code: processError.code,
        signal: processError.signal, killed: processError.killed,
      },
      reportError: reportError?.message,
      runtimeError: report?.runtimeError,
    }, null, 2));
    onAttempt(record);
    if (retry) {
      await wait(attempt * 1000);
      continue;
    }
    if (processError) throw processError;
    if (reportError) throw reportError;
    if (report?.runtimeError) {
      throw new Error(`Lighthouse ${report.runtimeError.code}: ${report.runtimeError.message}`);
    }
    // Complete measurements are returned regardless of score. Quality gates never trigger retries.
    return { report, attempts };
  }
}
