import { strict as assert } from 'node:assert';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const api = await import(pathToFileURL(join(root, 'dist/index.js')).href);
assert.equal(typeof api.ZentaoClient, 'function');
assert.equal(typeof api.request, 'function');

const client = new api.ZentaoClient('https://zentao.example.com/api.php/v2');
assert.equal(client.baseUrl, 'https://zentao.example.com/api.php/v2');

const browserApi = await import(pathToFileURL(join(root, 'dist/browser.js')).href);
assert.equal(typeof browserApi.ZentaoClient, 'function');

console.log(`Node ${process.version} package smoke test passed.`);
