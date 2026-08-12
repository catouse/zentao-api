import { afterEach, describe, expect, test } from 'bun:test';
import {
  defineModules,
  exportRegistry,
  getModule,
  type ModuleDefinition,
} from '../src/index';
import { resetModuleDefinitions } from '../src/modules/registry';

afterEach(() => {
  resetModuleDefinitions();
});

function defineExportFixture(): void {
  defineModules({
    name: 'export-fixture',
    actions: [
      {
        name: 'create',
        type: 'create',
        path: '/export-fixtures',
        requestBody: {
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              name: { type: 'string', description: 'Fixture name' },
              amount: { type: 'number' },
            },
          },
        },
      },
    ],
  });
}

describe('exportRegistry', () => {
  test('returns transformed actions with bodyParams and without requestBody', () => {
    defineExportFixture();

    const registry = exportRegistry();
    const [action] = registry['export-fixture'].actions;

    expect(action.bodyParams).toEqual([
      {
        name: 'name',
        role: 'body',
        required: true,
        type: 'string',
        description: 'Fixture name',
      },
      {
        name: 'amount',
        role: 'body',
        required: false,
        type: 'number',
      },
    ]);
    expect(Object.hasOwn(action, 'requestBody')).toBe(false);
  });

  test('returns original module definitions in raw mode', () => {
    defineExportFixture();

    const registry = exportRegistry({ raw: true });
    const module: ModuleDefinition = registry['export-fixture'];

    expect(module).toBe(getModule('export-fixture')!);
    expect(module.actions[0].requestBody).toBeDefined();
    expect(Object.hasOwn(module.actions[0], 'bodyParams')).toBe(false);
  });

  test('does not install the browser global when importing the main entry', () => {
    const entry = new URL('../src/index.ts', import.meta.url).href;
    const script = `delete globalThis.ZentaoAPI; await import(${JSON.stringify(entry)}); process.stdout.write(String(Object.hasOwn(globalThis, 'ZentaoAPI')));`;
    const result = Bun.spawnSync({
      cmd: [process.execPath, '-e', script],
      stdout: 'pipe',
      stderr: 'pipe',
    });

    expect(result.exitCode).toBe(0);
    expect(new TextDecoder().decode(result.stdout)).toBe('false');
  });
});
