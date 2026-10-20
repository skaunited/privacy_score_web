import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readdir, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { KEY_FILE, MANIFEST_FILE } from './indexnow.mjs';

const deployRef = 'refs/heads/deploy';
const sourceFiles = new Set([
  '.git',
  '.github',
  'src',
  'scripts',
  'docs',
  'public',
  'node_modules',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  'CLAUDE.md',
  'DEPLOY.md',
  'astro.config.mjs',
  'README.md',
]);

async function validateBuild(directory, root = true) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (
      entry.isSymbolicLink() ||
      (entry.name.startsWith('.') && !(root && entry.name === '.well-known')) ||
      (root && sourceFiles.has(entry.name))
    )
      throw new Error(
        `Refusing to publish a source file or unsafe build entry: ${entry.name}`,
      );
    if (entry.isDirectory())
      await validateBuild(join(directory, entry.name), false);
    else if (!entry.isFile())
      throw new Error(
        'The build must contain only regular files and directories.',
      );
  }
}

export async function publishBuild({
  repoDir = process.cwd(),
  buildDir = 'dist',
} = {}) {
  const directory = resolve(repoDir, buildDir);
  for (const file of ['index.html', 'fr/index.html', '404.html', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', '.well-known/security.txt', KEY_FILE, MANIFEST_FILE]) {
    const info = await stat(join(directory, file));
    if (!info.isFile() || !info.size)
      throw new Error(`Incomplete build: ${file}`);
  }
  await validateBuild(directory);

  const git = (args, options = {}) =>
    execFileSync('git', args, {
      cwd: repoDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    }).trim();
  const source = git(['rev-parse', 'HEAD']);
  const gitDir = git(['rev-parse', '--absolute-git-dir']);
  const remote = spawnSync(
    'git',
    ['ls-remote', '--exit-code', '--heads', 'origin', deployRef],
    {
      cwd: repoDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  if (remote.status !== 0 && remote.status !== 2)
    throw new Error(
      'Cannot read the deploy branch from origin. Check repository access.',
    );
  let parent;
  if (remote.status === 0) {
    git(['fetch', '--no-tags', '--depth=1', 'origin', deployRef]);
    parent = git(['rev-parse', 'FETCH_HEAD']);
  }

  // A separate index stages dist/ without changing main or the source checkout.
  const temporary = await mkdtemp(join(tmpdir(), 'privacy-score-publish-'));
  try {
    const env = {
      ...process.env,
      GIT_DIR: gitDir,
      GIT_WORK_TREE: directory,
      GIT_INDEX_FILE: join(temporary, 'index'),
    };
    const buildGit = (args, options = {}) => git(args, { cwd: directory, env, ...options });
    buildGit(['read-tree', '--empty']);
    buildGit(['add', '--all', '--force', '--', '.']);
    // Keep previously published hashed assets for cached pages and rollback.
    // Current build files always win. Obsolete HTML is removed normally.
    if (parent) {
      const current = new Set(buildGit(['ls-files', '-z']).split('\0'));
      const previous = git(['ls-tree', '-rz', parent, '--', '_astro/']).split('\0').filter(Boolean);
      const retained = [];
      for (const entry of previous) {
        const match = /^(100644|100755) blob ([a-f0-9]+)\t(_astro\/(?:[\w-][\w.-]*\/)*[\w-][\w.-]*)$/.exec(entry);
        if (!match) throw new Error('Refusing to retain an unsafe previous asset.');
        const [, mode, object, path] = match;
        if (!current.has(path)) retained.push(`${mode} ${object}\t${path}\0`);
      }
      if (retained.length) buildGit(['update-index', '-z', '--index-info'], {
        input: retained.join(''), stdio: ['pipe', 'pipe', 'pipe'],
      });
    }
    const tree = buildGit(['write-tree']);
    const identity = {
      ...process.env,
      GIT_AUTHOR_NAME: 'github-actions[bot]',
      GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
      GIT_COMMITTER_NAME: 'github-actions[bot]',
      GIT_COMMITTER_EMAIL:
        '41898282+github-actions[bot]@users.noreply.github.com',
    };
    const commit = git(
      [
        'commit-tree',
        tree,
        ...(parent ? ['-p', parent] : []),
        '-m',
        `Build site from ${source}`,
      ],
      { env: identity },
    );
    // A normal push preserves deployment history and rejects concurrent changes.
    git(['push', 'origin', `${commit}:${deployRef}`]);
    return { source, commit, branch: 'deploy' };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const result = await publishBuild();
    console.log(
      `Verified site published to ${result.branch}: ${result.commit}`,
    );
  } catch {
    console.error(
      'Build publication failed. Check the artifact, origin access and write permission on the deploy branch.',
    );
    process.exitCode = 1;
  }
}
