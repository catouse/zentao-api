import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';

describe('browser bundle', () => {
  test('exposes window.ZentaoAPI with build info and rejects insecure requests in browser runtime', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'zentao-api-browser-'));
    const injectedVersion = '1.2.3-test';
    const injectedBuild = '2026-05-10T01:02:03.000Z';

    try {
      const result = await Bun.build({
        entrypoints: ['src/browser.ts'],
        outdir: dir,
        target: 'browser',
        format: 'iife',
        globalName: 'ZentaoAPI',
        define: {
          __ZENTAO_API_BUILD__: JSON.stringify(injectedBuild),
          __ZENTAO_API_VERSION__: JSON.stringify(injectedVersion),
        },
      } as any);

      expect(result.success).toBe(true);

      const code = readFileSync(join(dir, 'browser.js'), 'utf8');
      const context = vm.createContext({
        window: {},
        self: {},
        console,
        setTimeout,
        clearTimeout,
        URL,
        URLSearchParams,
        Headers,
        Response,
        fetch: () => Promise.resolve(Response.json({ status: 'success' })),
      });

      vm.runInContext(code, context);

      const api = (context as any).ZentaoAPI ?? (context as any).window.ZentaoAPI;
      expect((context as any).window.ZentaoAPI.VERSION).toBe(injectedVersion);
      expect((context as any).window.ZentaoAPI.BUILD).toBe(injectedBuild);
      expect(api.VERSION).toBe(injectedVersion);
      expect(api.BUILD).toBe(injectedBuild);
      expect(api.ZentaoClient).toBeFunction();
      const client = new api.ZentaoClient('https://zentao.example.com');

      await expect(client.request('/products', { insecure: true })).rejects.toThrow('insecure');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
