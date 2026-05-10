import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ZentaoError } from './errors.js';

const JS_EXTENSION_RE = /\.(?:mjs|cjs|js)$/;

/**
 * 从目录按文件名顺序加载模块扩展文件。
 *
 * 扩展文件通过调用 `defineModules()` / `defineModuleActions()` 产生副作用；
 * 运行时不直接加载 `.ts`，TypeScript 扩展需先编译为 JS。
 */
export async function loadModuleDefinitionsFromDirectory(dir: string): Promise<void> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && JS_EXTENSION_RE.test(entry.name))
      .map((entry) => entry.name)
      // 排序保证多文件覆盖/追加动作时结果稳定可预测。
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      await import(pathToFileURL(join(dir, file)).href);
    }
  } catch (error) {
    if (error instanceof ZentaoError) throw error;
    throw new ZentaoError('E_EXTENSION_LOAD_FAILED', { message: (error as Error).message ?? String(error) }, error);
  }
}
