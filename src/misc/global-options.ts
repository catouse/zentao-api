import type { GlobalOptions } from '../types/index.js';

let globalOptions: GlobalOptions = {};

/** 获取当前全局选项快照；返回副本，避免调用方直接改写内部状态。 */
export function getGlobalOptions(): GlobalOptions {
  return { ...globalOptions };
}

/** 合并设置全局选项；传入 `undefined` 可清空对应字段。 */
export function setGlobalOptions(options: Partial<GlobalOptions>): void {
  globalOptions = { ...globalOptions, ...options };
}
