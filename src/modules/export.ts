import type { ModuleAction, ModuleActionParam, ModuleDefinition } from '../types/index.js';
import { getModuleActionParams } from './query.js';
import { getModuleMapState } from './registry-store.js';

/** 导出的模块动作定义。 */
export type ExportedModuleAction = Omit<ModuleAction, 'requestBody'> & {
  bodyParams: ModuleActionParam[];
};

/** 导出的模块定义。 */
export type ExportedModuleDefinition = Omit<ModuleDefinition, 'actions'> & {
  actions: ExportedModuleAction[];
};

/** {@link exportRegistry} 的选项。 */
export interface ExportRegistryOptions {
  /** 是否保留注册表中的原始模块定义。 */
  raw?: boolean;
}

/**
 * 导出注册表。
 *
 * 默认会把动作的 `requestBody` 转换成扁平的 `bodyParams`；传入 `raw: true`
 * 时则返回注册表中的原始模块定义。
 *
 * @param options - 导出选项。
 * @returns 以模块名为键的模块定义。
 */
export function exportRegistry(options: { raw: true }): Record<string, ModuleDefinition>;
export function exportRegistry(options?: { raw?: false }): Record<string, ExportedModuleDefinition>;
export function exportRegistry(options: ExportRegistryOptions): Record<string, ModuleDefinition | ExportedModuleDefinition>;
export function exportRegistry(options: ExportRegistryOptions = {}): Record<string, ModuleDefinition | ExportedModuleDefinition> {
  const raw = options?.raw ?? false;
  const registry = {} as Record<string, ModuleDefinition | ExportedModuleDefinition>;

  getModuleMapState().forEach((module) => {
    if (raw) {
      registry[module.name] = module;
      return;
    }

    registry[module.name] = {
      ...module,
      actions: module.actions.map((action) => {
        const { requestBody, ...definition } = action;
        return {
          ...definition,
          bodyParams: requestBody
            ? getModuleActionParams(module.name, action.name, { roles: ['body'] })
            : [],
        };
      }),
    };
  });

  return registry;
}
