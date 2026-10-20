import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publishBuild } from './publish-build.mjs';
import { KEY_FILE, MANIFEST_FILE } from './indexnow.mjs';

async function repository(t) {
  const directory = await mkdtemp(join(tmpdir(), 'privacy-score git test '));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const origin = join(directory, 'origin.git');
  const repoDir = join(directory, 'source');
  await mkdir(repoDir);
  const git = (args, cwd = repoDir) =>
    execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  git(['init', '--bare', origin]);
  git(['init', '-b', 'main']);
  git(['config', 'user.name', 'Deployment test']);
  git(['config', 'user.email', 'test@example.invalid']);
  git(['config', 'commit.gpgsign', 'false']);
  await writeFile(join(repoDir, '.gitignore'), 'dist/\n');
  await writeFile(
    join(repoDir, 'private-source.txt'),
    'Source code must stay on main.',
  );
  git(['add', '.']);
  git(['commit', '-m', 'Initial source']);
  git(['remote', 'add', 'origin', origin]);
  git(['push', 'origin', 'main']);
  await mkdir(join(repoDir, 'dist/fr'), { recursive: true });
  await mkdir(join(repoDir, 'dist/.well-known'), { recursive: true });
  await mkdir(join(repoDir, 'dist/_astro'), { recursive: true });
  for (const file of ['index.html', 'fr/index.html', '404.html', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', '.well-known/security.txt', KEY_FILE, MANIFEST_FILE])
    await writeFile(join(repoDir, 'dist', file), `built ${file}`);
  return {
    repoDir,
    origin,
    git,
    remote: (args) => git(['--git-dir', origin, ...args]),
  };
}

test('the first deploy branch contains only the built files, including .well-known/security.txt, while main and its index stay unchanged', async (t) => {
  const site = await repository(t);
  const original = site.git(['rev-parse', 'HEAD']);
  await writeFile(join(site.repoDir, 'staged.txt'), 'Keep this staged change.');
  site.git(['add', 'staged.txt']);
  const result = await publishBuild({ repoDir: site.repoDir });
  assert.equal(result.source, original);
  assert.equal(result.branch, 'deploy');
  assert.deepEqual(
    site.remote(['ls-tree', '-r', '--name-only', 'deploy']).split('\n'),
    ['.well-known/security.txt', '404.html', KEY_FILE, 'fr/index.html', 'index.html', MANIFEST_FILE, 'robots.txt', 'sitemap-0.xml', 'sitemap-index.xml'].sort(),
  );
  assert.equal(site.remote(['show', 'deploy:.well-known/security.txt']), 'built .well-known/security.txt');
  assert.equal(site.remote(['rev-parse', 'main']), original);
  assert.equal(site.git(['rev-parse', 'HEAD']), original);
  assert.equal(site.git(['branch', '--show-current']), 'main');
  assert.equal(site.git(['diff', '--cached', '--name-only']), 'staged.txt');
  assert.equal(site.remote(['rev-list', '--count', 'deploy']), '1');
});

test('subsequent builds update deploy normally, keep its history and remove obsolete build files', async (t) => {
  const site = await repository(t);
  await writeFile(join(site.repoDir, 'dist/old.txt'), 'old asset');
  await writeFile(join(site.repoDir, 'dist/_astro/old.hash.css'), 'cached stylesheet');
  await writeFile(join(site.repoDir, 'dist/_astro/current.hash.css'), 'first stylesheet');
  const first = await publishBuild({ repoDir: site.repoDir });
  await rm(join(site.repoDir, 'dist/old.txt'));
  await rm(join(site.repoDir, 'dist/_astro/old.hash.css'));
  await writeFile(join(site.repoDir, 'dist/_astro/current.hash.css'), 'current stylesheet');
  await writeFile(join(site.repoDir, 'dist/index.html'), 'new home page');
  const second = await publishBuild({ repoDir: site.repoDir });
  assert.equal(site.remote(['rev-parse', 'deploy^']), first.commit);
  assert.equal(site.remote(['rev-parse', 'deploy']), second.commit);
  assert.equal(site.remote(['show', 'deploy:index.html']), 'new home page');
  assert.ok(
    !site
      .remote(['ls-tree', '-r', '--name-only', 'deploy'])
      .includes('old.txt'),
  );
  assert.equal(site.remote(['rev-list', '--count', 'deploy']), '2');
  assert.equal(site.remote(['show', 'deploy:_astro/old.hash.css']), 'cached stylesheet');
  assert.equal(site.remote(['show', 'deploy:_astro/current.hash.css']), 'current stylesheet');
  assert.ok(!site.git(['ls-files']).includes('_astro/'));
});

test('incomplete builds, source files, hidden secrets and symlinks are refused before publishing', async (t) => {
  const site = await repository(t);
  const path = (file) => join(site.repoDir, 'dist', file);
  await rm(path('.well-known/security.txt'));
  await assert.rejects(publishBuild({ repoDir: site.repoDir }));
  await writeFile(path('.well-known/security.txt'), 'headers');
  for (const file of [KEY_FILE, MANIFEST_FILE]) {
    await rm(path(file));
    await assert.rejects(publishBuild({ repoDir: site.repoDir }), { code: 'ENOENT' });
    await writeFile(path(file), `built ${file}`);
  }
  for (const file of ['.env', 'package.json', 'pnpm-lock.yaml', '.well-known/.env']) {
    await writeFile(path(file), 'must not be published');
    await assert.rejects(
      publishBuild({ repoDir: site.repoDir }),
      /Refusing to publish/,
    );
    await rm(path(file));
  }
  await symlink('/etc/passwd', path('unsafe-link'));
  await assert.rejects(
    publishBuild({ repoDir: site.repoDir }),
    /Refusing to publish/,
  );
  assert.equal(
    site.remote(['for-each-ref', '--format=%(refname)', 'refs/heads/deploy']),
    '',
  );
});

test('repository access and push failures stop publication without changing main', async (t) => {
  const site = await repository(t);
  const main = site.git(['rev-parse', 'HEAD']);
  site.git(['remote', 'set-url', 'origin', join(site.repoDir, 'missing.git')]);
  await assert.rejects(
    publishBuild({ repoDir: site.repoDir }),
    /Cannot read the deploy branch/,
  );
  site.git(['remote', 'set-url', 'origin', site.origin]);
  await writeFile(
    join(site.origin, 'hooks/pre-receive'),
    '#!/bin/sh\nexit 1\n',
    { mode: 0o755 },
  );
  await assert.rejects(publishBuild({ repoDir: site.repoDir }));
  assert.equal(
    site.remote(['for-each-ref', '--format=%(refname)', 'refs/heads/deploy']),
    '',
  );
  assert.equal(site.git(['rev-parse', 'HEAD']), main);
});
