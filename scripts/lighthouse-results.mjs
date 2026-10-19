export const auditRuns = 3;
const categories = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
  'agentic-browsing',
];
const metrics = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
];

function median(values) {
  return [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
}

export function summarizeScenario(name, reports) {
  if (reports.length !== auditRuns)
    throw new Error(`${name}: expected ${auditRuns} complete audits`);
  const samples = reports.map((report, index) => {
    const label = `${name} run ${index + 1}`;
    if (report.runtimeError)
      throw new Error(`${label}: ${report.runtimeError.message}`);
    const scores = Object.fromEntries(
      categories.map((category) => {
        const score = report.categories?.[category]?.score;
        if (!Number.isFinite(score) || score < 0 || score > 1)
          throw new Error(`${label}: missing or invalid ${category} score`);
        return [category, score];
      }),
    );
    const values = Object.fromEntries(
      metrics.map((metric) => {
        const value = report.audits?.[metric]?.numericValue;
        if (!Number.isFinite(value) || value < 0)
          throw new Error(`${label}: missing or invalid ${metric}`);
        return [metric, value];
      }),
    );
    return {
      run: index + 1,
      lighthouseVersion: report.lighthouseVersion,
      chrome: report.environment?.hostUserAgent,
      benchmarkIndex: report.environment?.benchmarkIndex,
      scores,
      metrics: values,
    };
  });

  // Aggregate all three cold-browser runs, never retry until one passes.
  // Performance metrics fluctuate; semantic failures must pass on EVERY run.
  const scores = Object.fromEntries(
    categories.map((category) => {
      const values = samples.map((sample) => sample.scores[category]);
      return [
        category,
        category === 'performance' ? median(values) : Math.min(...values),
      ];
    }),
  );
  const values = Object.fromEntries(
    metrics.map((metric) => [
      metric,
      median(samples.map((sample) => sample.metrics[metric])),
    ]),
  );
  const failures = [];
  for (const [category, score] of Object.entries(scores)) {
    const minimum = category === 'performance' ? 0.95 : 1;
    if (score < minimum) failures.push(`${name}: ${category} = ${score}`);
  }
  if (values['total-blocking-time'] > 150)
    failures.push(`${name}: median blocking time exceeds 150 ms`);
  if (values['cumulative-layout-shift'] > 0.02)
    failures.push(`${name}: median layout shift exceeds 0.02`);

  return {
    name,
    aggregation: {
      runs: auditRuns,
      performance: 'median',
      metrics: 'median',
      otherCategories: 'minimum',
    },
    scores,
    metrics: values,
    samples,
    failures,
  };
}
