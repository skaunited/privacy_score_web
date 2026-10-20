import { resolve } from 'node:path';
import { prepareManifest } from './indexnow.mjs';

const result = await prepareManifest(resolve(process.argv[2] ?? 'dist'));
console.log(`IndexNow manifest: ${Object.keys(result.pages).length} canonical pages, release ${result.release}.`);
