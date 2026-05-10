import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('package exports', () => {
  test('does not expose the removed Node directory loader entrypoint', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      exports: Record<string, unknown>;
    };

    expect(Object.hasOwn(packageJson.exports, './node')).toBe(false);
  });
});
