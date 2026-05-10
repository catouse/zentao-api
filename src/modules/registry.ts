import { ZentaoError } from '../misc/errors.js';
import type { ModuleAction, ModuleDefinition } from '../types/index.js';
import { asArray } from '../utils/index.js';
import { BUILTIN_MODULES } from './generated.js';

export { BUILTIN_MODULES };
export const MODULES = BUILTIN_MODULES;

// 运行时注册表使用内置定义的浅克隆，避免用户扩展污染生成文件导出的常量。
let modules = cloneModules(BUILTIN_MODULES);
let moduleMap = buildModuleMap(modules);

function cloneModules(source: readonly ModuleDefinition[]): ModuleDefinition[] {
  return source.map((module) => ({
    ...module,
    actions: module.actions.map((action) => ({ ...action })),
  }));
}

function buildModuleMap(source: readonly ModuleDefinition[]): Map<string, ModuleDefinition> {
  return new Map(source.map((module) => [module.name.toLowerCase(), module]));
}

function rebuildMap(): void {
  moduleMap = buildModuleMap(modules);
}

function validateModule(module: ModuleDefinition): void {
  if (!module || typeof module.name !== 'string' || !Array.isArray(module.actions)) {
    throw new ZentaoError('E_INVALID_MODULE_DEFINITION');
  }
}

function validateAction(action: ModuleAction): void {
  if (!action || typeof action.name !== 'string' || typeof action.path !== 'string' || typeof action.method !== 'string') {
    throw new ZentaoError('E_INVALID_ACTION_DEFINITION');
  }
}

/** 定义或覆盖模块；同名模块整体替换，未知模块追加。 */
export function defineModules(input: ModuleDefinition | ModuleDefinition[]): void {
  for (const module of asArray(input)) {
    validateModule(module);
    const key = module.name.toLowerCase();
    const index = modules.findIndex((item) => item.name.toLowerCase() === key);
    const next = { ...module, actions: module.actions.map((action) => ({ ...action })) };
    // 同名模块采用整体替换，便于用户完整覆盖生成定义。
    if (index >= 0) {
      modules[index] = next;
    } else {
      modules.push(next);
    }
  }
  rebuildMap();
}

/** 为已存在模块定义或覆盖动作；同名动作替换，未知动作追加。 */
export function defineModuleActions(moduleName: string, input: ModuleAction | ModuleAction[]): void {
  const module = moduleMap.get(moduleName.toLowerCase());
  if (!module) {
    throw new ZentaoError('E_INVALID_MODULE', { module: moduleName });
  }

  for (const action of asArray(input)) {
    validateAction(action);
    const key = String(action.name).toLowerCase();
    const index = module.actions.findIndex((item) => String(item.name).toLowerCase() === key);
    const next = { ...action };
    // 同名动作替换，未知动作追加；不做深度合并，避免 schema/数组字段出现隐式规则。
    if (index >= 0) {
      module.actions[index] = next;
    } else {
      module.actions.push(next);
    }
  }
}

/** 获取模块定义；模块不存在时抛出 {@link ZentaoError}。 */
export function getModule(moduleName: string): ModuleDefinition {
  const module = moduleMap.get(moduleName.toLowerCase());
  if (!module) {
    throw new ZentaoError('E_INVALID_MODULE', { module: moduleName });
  }
  return module;
}

/** 获取指定模块动作；`ls` 会作为 `list` 的别名处理。 */
export function getModuleAction(moduleName: string, actionName: string): ModuleAction {
  const module = getModule(moduleName);
  const normalized = actionName === 'ls' ? 'list' : actionName;
  const direct = module.actions.find((action) => String(action.name).toLowerCase() === normalized.toLowerCase());
  if (direct) return direct;

  const crud = new Set(['list', 'get', 'create', 'update', 'delete']);
  if (!crud.has(normalized)) {
    const custom = module.actions.find((action) => action.type === 'action' && String(action.name).toLowerCase() === normalized.toLowerCase());
    if (custom) return custom;
  }

  throw new ZentaoError('E_INVALID_ACTION', { module: moduleName, action: actionName });
}

/** 返回当前运行时注册表中的所有模块名。 */
export function getModuleNames(): string[] {
  return modules.map((module) => module.name);
}

/** 判断模块名是否已注册，大小写不敏感。 */
export function isModuleName(moduleName: string): boolean {
  return moduleMap.has(moduleName.toLowerCase());
}

/** @internal */
export function resetModuleDefinitions(): void {
  modules = cloneModules(BUILTIN_MODULES);
  rebuildMap();
}
