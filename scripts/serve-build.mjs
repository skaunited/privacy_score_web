import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
};

// Serve the actual build, compression and headers for repeatable local audits.
// This is test tooling, not a runtime dependency or a production Node server.
export async function serveBuild({ port = 0, directory = 'dist' } = {}) {
  const root = resolve(directory);
  // Apply the proposed headers during audits; this does not validate Plesk's
  // effective configuration. Parse active add_header lines only.
  const policy = await readFile(new URL('../deploy/plesk-security.nginx.conf', import.meta.url), 'utf8');
  const headers = Object.fromEntries(
    [...policy.matchAll(/^add_header ([\w-]+) "([^"\n]+)" always;/gm)]
      .map((match) => [match[1], match[2]]),
  );
  const server = createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405).end();
        return;
      }
      const url = new URL(request.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);
      if (
        path
          .split('/')
          .some((part) => part.startsWith('.') && part !== '.well-known')
      ) {
        response.writeHead(403).end();
        return;
      }
      let file = resolve(root, `.${path}`);
      if (file !== root && !file.startsWith(`${root}${sep}`)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) {
        if (!path.endsWith('/')) {
          response
            .writeHead(301, { Location: `${url.pathname}/${url.search}` })
            .end();
          return;
        }
        file = resolve(file, 'index.html');
      }
      const body = await readFile(file);
      const type = types[extname(file)] || 'application/octet-stream';
      const compressed =
        /^(text\/|application\/(javascript|json|xml)|image\/svg)/.test(type) &&
        /\bgzip\b/.test(request.headers['accept-encoding'] || '');
      const payload = compressed ? gzipSync(body) : body;
      response.writeHead(200, {
        ...headers,
        'Content-Type': type,
        'Content-Length': payload.length,
        'Cache-Control': path.startsWith('/_astro/')
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=0, must-revalidate',
        Vary: 'Accept-Encoding',
        ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
      });
      response.end(request.method === 'HEAD' ? undefined : payload);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 400).end();
    }
  });
  await new Promise((accept, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', accept);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((done) => server.close(done)),
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const port = Number(process.argv[process.argv.indexOf('--port') + 1]) || 4324;
  const preview = await serveBuild({ port });
  console.log(preview.url);
  const stop = async () => {
    await preview.close();
    process.exit();
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}
