import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getModuleAction } from '../src/index';
import { loadModuleDefinitionsFromDirectory } from '../src/node';

describe('loadModuleDefinitionsFromDirectory', () => {
  test('imports JavaScript extension files in deterministic filename order', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'zentao-api-ext-'));
    const sourceUrl = pathToFileURL(join(process.cwd(), 'src/index.ts')).href;

    try {
      writeFileSync(join(dir, '02-replace.mjs'), [
        `import { defineModuleActions } from ${JSON.stringify(sourceUrl)};`,
        `defineModuleActions('loadercase', { name: 'run', type: 'action', method: 'POST', path: '/second', resultType: 'text' });`,
      ].join('\n'));
      writeFileSync(join(dir, '01-module.mjs'), [
        `import { defineModules } from ${JSON.stringify(sourceUrl)};`,
        `defineModules({ name: 'loadercase', actions: [{ name: 'run', type: 'action', method: 'POST', path: '/first', resultType: 'text' }] });`,
      ].join('\n'));

      await loadModuleDefinitionsFromDirectory(dir);

      expect(getModuleAction('loadercase', 'run').path).toBe('/second');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
