import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeScenario } from './lighthouse-results.mjs';

function report(performance = 1, blocking = 0) {
  return {
    lighthouseVersion: '13.5.0',
    categories: Object.fromEntries(
      [
        'performance',
        'accessibility',
        'best-practices',
        'seo',
        'agentic-browsing',
      ].map((category) => [
        category,
        { score: category === 'performance' ? performance : 1 },
      ]),
    ),
    audits: Object.fromEntries(
      Object.entries({
        'first-contentful-paint': 1200,
        'largest-contentful-paint': 1800,
        'total-blocking-time': blocking,
        'cumulative-layout-shift': 0,
        'speed-index': 1400,
      }).map(([metric, value]) => [metric, { numericValue: value }]),
    ),
  };
}

test('one isolated slow run remains visible but does not replace the median', () => {
  const result = summarizeScenario('en-mobile', [
    report(0.94, 271.395),
    report(),
    report(),
  ]);
  assert.deepEqual(result.failures, []);
  assert.equal(result.scores.performance, 1);
  assert.equal(result.metrics['total-blocking-time'], 0);
  assert.equal(result.samples[0].scores.performance, 0.94);
  assert.equal(result.samples[0].metrics['total-blocking-time'], 271.395);
});

test('a repeated slowdown fails even if one run reaches 100', () => {
  const result = summarizeScenario('en-mobile', [
    report(),
    report(0.94, 271),
    report(0.93, 310),
  ]);
  assert.equal(result.scores.performance, 0.94);
  assert.equal(result.metrics['total-blocking-time'], 271);
  assert.ok(
    result.failures.some((message) => message.includes('performance = 0.94')),
  );
  assert.ok(
    result.failures.some((message) => message.includes('exceeds 150 ms')),
  );
});

test('the reported 64/95/94 mobile run still fails the 95-point budget', () => {
  const result = summarizeScenario('en-mobile', [
    report(0.64, 1162.5),
    report(0.95),
    report(0.94),
  ]);
  assert.equal(result.scores.performance, 0.94);
  assert.equal(result.metrics['total-blocking-time'], 0);
  assert.deepEqual(result.failures, ['en-mobile: performance = 0.94']);
});

test('semantic failures on even one run still fail the pipeline', () => {
  for (const category of [
    'accessibility',
    'best-practices',
    'seo',
    'agentic-browsing',
  ]) {
    const broken = report();
    broken.categories[category].score = 0.99;
    const result = summarizeScenario('fr-mobile', [report(), broken, report()]);
    assert.ok(
      result.failures.some((message) => message.includes(`${category} = 0.99`)),
    );
  }
});

test('missing or invalid measurements and browser errors cannot count as passes', () => {
  assert.throws(
    () => summarizeScenario('en-mobile', [report()]),
    /3 complete audits/,
  );
  const missing = report();
  delete missing.categories['agentic-browsing'];
  assert.throws(
    () => summarizeScenario('en-mobile', [report(), missing, report()]),
    /agentic-browsing/,
  );
  const invalid = report();
  invalid.audits['total-blocking-time'].numericValue = NaN;
  assert.throws(
    () => summarizeScenario('en-mobile', [report(), invalid, report()]),
    /total-blocking-time/,
  );
  const crashed = {
    ...report(),
    runtimeError: { message: 'Navigation failed' },
  };
  assert.throws(
    () => summarizeScenario('en-mobile', [report(), crashed, report()]),
    /Navigation failed/,
  );
});
