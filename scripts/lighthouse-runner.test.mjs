import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectLighthouseSample } from './lighthouse-runner.mjs';

const noNavstart = 'Runtime error encountered: Something went wrong with recording the trace over your page load. Please run Lighthouse again. (NO_NAVSTART)\n';
const valid = { categories: { performance: { score: 0.7 } } };

async function fixture(run) {
  const directory = await mkdtemp(join(tmpdir(), 'privacy-score-lighthouse-'));
  const attempts = [];
  const waits = [];
  const options = {
    cli: join(directory, 'fake-cli.mjs'),
    url: 'http://127.0.0.1:12345/', device: 'desktop',
    destination: join(directory, 'en-desktop-run-1'),
    onAttempt: (attempt) => attempts.push(attempt),
    wait: async (ms) => { waits.push(ms); },
  };
  try {
    await run({ directory, options, attempts, waits });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

for (const saveFailedReport of [true, false]) {
  test(`real CLI NO_NAVSTART is retried with distinct artifacts ${saveFailedReport ? 'with' : 'without'} a failed JSON report`, async () => {
    await fixture(async ({ options, attempts, waits }) => {
      await writeFile(options.cli, `
        import { writeFile } from 'node:fs/promises';
        import assert from 'node:assert/strict';
        assert.ok(process.argv.includes('--preset=desktop'));
        assert.ok(process.argv.includes('--save-assets'));
        assert.ok(process.argv.includes('--chrome-flags=--headless --disable-gpu'));
        const output = process.argv.find(arg => arg.startsWith('--output-path=')).slice('--output-path='.length);
        if (!output.endsWith('-attempt-2')) {
          if (${saveFailedReport}) await writeFile(output + '.report.json', JSON.stringify({runtimeError:{code:'NO_NAVSTART',message:'Trace is incomplete'}}));
          console.error(${JSON.stringify(noNavstart.trimEnd())});
          process.exitCode = 1;
        } else {
          await writeFile(output + '.report.json', JSON.stringify(${JSON.stringify(valid)}));
        }
      `);
      const result = await collectLighthouseSample(options);
      assert.deepEqual(result.report, valid); // Even this low score must not cause another retry.
      assert.equal(attempts.length, 2);
      assert.equal(attempts[0].runtimeCode, 'NO_NAVSTART');
      assert.equal(attempts[0].retry, true);
      assert.equal(attempts[1].status, 'complete');
      assert.notEqual(attempts[0].reportPath, attempts[1].reportPath);
      assert.deepEqual(waits, [1000]);
      const diagnostic = JSON.parse(await readFile(`${options.destination}.process.json`, 'utf8'));
      assert.equal(diagnostic.processError.code, 1);
      assert.equal(diagnostic.stderr, noNavstart);
      assert.equal(JSON.parse(await readFile(attempts[1].reportPath, 'utf8')).categories.performance.score, 0.7);
      if (saveFailedReport) {
        assert.equal(JSON.parse(await readFile(attempts[0].reportPath, 'utf8')).runtimeError.code, 'NO_NAVSTART');
      }
    });
  });
}

test('three trace failures stop the sample and retain all diagnostics', async () => {
  await fixture(async ({ options, attempts, waits }) => {
    await writeFile(options.cli, `console.error(${JSON.stringify(noNavstart.trimEnd())}); process.exitCode = 1;`);
    await assert.rejects(collectLighthouseSample(options), /NO_NAVSTART/);
    assert.equal(attempts.length, 3);
    assert.deepEqual(attempts.map((attempt) => attempt.retry), [true, true, false]);
    assert.deepEqual(waits, [1000, 2000]);
    for (const attempt of attempts) {
      const diagnostic = JSON.parse(await readFile(attempt.reportPath.replace(/\.report\.json$/, '.process.json'), 'utf8'));
      assert.equal(diagnostic.runtimeCode, 'NO_NAVSTART');
      assert.equal(diagnostic.status, 'error');
    }
  });
});

test('a complete low score is returned after one invocation without a retry', async () => {
  await fixture(async ({ options, attempts, waits }) => {
    const result = await collectLighthouseSample({
      ...options,
      execute: async (_node, args) => {
        const output = args.find((arg) => arg.startsWith('--output-path=')).slice('--output-path='.length);
        await writeFile(`${output}.report.json`, JSON.stringify(valid));
        return { stdout: '', stderr: '' };
      },
    });
    assert.equal(result.report.categories.performance.score, 0.7);
    assert.equal(attempts.length, 1);
    assert.deepEqual(waits, []);
  });
});

for (const [name, error] of [
  ['page load error', Object.assign(new Error('Navigation failed'), { code:1, stderr:'Runtime error encountered: Navigation failed (ERRORED_DOCUMENT_REQUEST)\n' })],
  ['timeout', Object.assign(new Error('Command timed out'), { code:1, killed:true, stderr:noNavstart })],
  ['signal', Object.assign(new Error('Killed'), { code:null, signal:'SIGTERM', stderr:noNavstart })],
  ['unknown exit', Object.assign(new Error('Exited 2'), { code:2, stderr:noNavstart })],
  ['unrelated text', Object.assign(new Error('Unknown'), { code:1, stderr:'Unable to load http://127.0.0.1/NO_NAVSTART\n' })],
]) {
  test(`${name} is never retried`, async () => {
    await fixture(async ({ options, attempts, waits }) => {
      await assert.rejects(collectLighthouseSample({ ...options, execute:async () => { throw error; } }), (caught) => caught === error);
      assert.equal(attempts.length, 1);
      assert.deepEqual(waits, []);
    });
  });
}

test('a different structured runtime error takes precedence over NO_NAVSTART stderr', async () => {
  await fixture(async ({ options, attempts, waits }) => {
    await assert.rejects(collectLighthouseSample({
      ...options,
      execute: async () => {
        await writeFile(`${options.destination}.report.json`, JSON.stringify({ runtimeError:{code:'NO_FCP',message:'No content painted'} }));
        throw Object.assign(new Error('No content painted'), { code:1, stderr:noNavstart });
      },
    }), /No content painted/);
    assert.equal(attempts.length, 1);
    assert.equal(attempts[0].runtimeCode, 'NO_FCP');
    assert.deepEqual(waits, []);
  });
});

test('a structured NO_NAVSTART report also retries when the CLI exits successfully', async () => {
  await fixture(async ({ options, attempts, waits }) => {
    const result = await collectLighthouseSample({
      ...options,
      execute: async (_node, args) => {
        const output = args.find((arg) => arg.startsWith('--output-path=')).slice('--output-path='.length);
        const report = attempts.length ? valid : {runtimeError:{code:'NO_NAVSTART',message:'Trace is incomplete'}};
        await writeFile(`${output}.report.json`, JSON.stringify(report));
        return {};
      },
    });
    assert.equal(result.attempts.length, 2);
    assert.deepEqual(waits, [1000]);
  });
});

for (const body of [undefined, '{incomplete JSON']) {
  test(`${body ? 'invalid' : 'missing'} JSON report is not retried without a trace diagnostic`, async () => {
    await fixture(async ({ options, attempts, waits }) => {
      await assert.rejects(collectLighthouseSample({
        ...options,
        execute: async () => {
          if (body) await writeFile(`${options.destination}.report.json`, body);
          return {};
        },
      }));
      assert.equal(attempts.length, 1);
      assert.deepEqual(waits, []);
    });
  });
}
