import { rename } from 'node:fs/promises';
import { join } from 'node:path';

const result = await Bun.build({
  entrypoints: ['src/browser.ts'],
  outdir: 'dist/browser',
  target: 'browser',
  format: 'iife',
  globalName: 'ZentaoAPI',
  minify: true,
} as any);

if (!result.success) {
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

await rename(join('dist/browser', 'browser.js'), join('dist/browser', 'zentao-api.global.js'));
