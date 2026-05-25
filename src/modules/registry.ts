import { ZentaoError } from '../misc/errors.js';
import type { ModuleAction, ModuleDefinition } from '../types/index.js';
import { asArray } from '../utils/index.js';
import { BUILTIN_MODULES } from './generated.js';

export { BUILTIN_MODULES };
export const MODULES = BUILTIN_MODULES;

export interface DefineModulesOptions {
  /** 同名模块是否整体替换；默认合并模块定义和动作。 */
  replace?: boolean;
}

// 运行时注册表存放「深克隆 + 深冻结」后的模块定义：
// - 深克隆：避免用户后续修改自己的输入对象时污染注册表；
// - 深冻结：让 getModule / getModuleAction 可以零拷贝返回引用，
//   外部尝试改写会在严格模式下抛 TypeError，开销也降到 O(1) 查询。
let modules = freezeModules(deepClone(BUILTIN_MODULES) as ModuleDefinition[]);
let moduleMap = buildModuleMap(modules);

function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T;
  }
  if (value && typeof value === 'object' && !(value instanceof Function)) {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      result[key] = deepClone(nestedValue);
    }
    return result as T;
  }
  return value;
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Object.isFrozen(value)) return value;
  for (const key of Object.keys(value)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.freeze(value);
}

function freezeAction(action: ModuleAction): ModuleAction {
  return deepFreeze(action);
}

function freezeModule(module: ModuleDefinition): ModuleDefinition {
  module.actions.forEach(freezeAction);
  return deepFreeze(module);
}

function freezeModules(source: ModuleDefinition[]): ModuleDefinition[] {
  source.forEach(freezeModule);
  return source;
}

function findActionIndex(source: readonly ModuleAction[], actionName: string): number {
  const key = actionName.toLowerCase();
  return source.findIndex((action) => String(action.name).toLowerCase() === key);
}

function mergeActions(base: readonly ModuleAction[], extension: readonly ModuleAction[]): ModuleAction[] {
  const next: ModuleAction[] = base.slice();
  for (const action of extension) {
    const index = findActionIndex(next, String(action.name));
    const frozen = freezeAction(deepClone(action));
    if (index >= 0) {
      next[index] = frozen;
    } else {
      next.push(frozen);
    }
  }
  return next;
}

function mergeModule(base: ModuleDefinition, extension: ModuleDefinition): ModuleDefinition {
  return freezeModule({
    ...base,
    ...deepClone(extension),
    actions: mergeActions(base.actions, extension.actions),
  });
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

/** 定义或扩展模块；同名模块默认合并动作，`replace` 为真时整体替换，未知模块追加。 */
export function defineModules(input: ModuleDefinition | ModuleDefinition[], options: DefineModulesOptions = {}): void {
  for (const module of asArray(input)) {
    validateModule(module);
    const key = module.name.toLowerCase();
    const index = modules.findIndex((item) => item.name.toLowerCase() === key);
    if (index >= 0) {
      modules[index] = options.replace
        ? freezeModule(deepClone(module))
        : mergeModule(modules[index], module);
    } else {
      modules.push(freezeModule(deepClone(module)));
    }
  }
  rebuildMap();
}

/** 为已存在模块定义或覆盖动作；同名动作替换，未知动作追加。 */
export function defineModuleActions(moduleName: string, input: ModuleAction | ModuleAction[]): void {
  const key = moduleName.toLowerCase();
  const module = moduleMap.get(key);
  if (!module) {
    throw new ZentaoError('E_INVALID_MODULE', { module: moduleName });
  }

  const actions: ModuleAction[] = module.actions.slice();
  for (const action of asArray(input)) {
    validateAction(action);
    const index = findActionIndex(actions, String(action.name));
    const frozen = freezeAction(deepClone(action));
    // 同名动作替换，未知动作追加；不做深度合并，避免 schema/数组字段出现隐式规则。
    if (index >= 0) {
      actions[index] = frozen;
    } else {
      actions.push(frozen);
    }
  }

  const nextModule = freezeModule({ ...module, actions });
  const index = modules.findIndex((item) => item.name.toLowerCase() === key);
  modules[index] = nextModule;
  rebuildMap();
}

/** 获取模块定义；模块不存在时抛出 {@link ZentaoError}。返回值已深冻结，请勿修改。 */
export function getModule(moduleName: string): ModuleDefinition {
  const module = moduleMap.get(moduleName.toLowerCase());
  if (!module) {
    throw new ZentaoError('E_INVALID_MODULE', { module: moduleName });
  }
  return module;
}

/** 获取指定模块动作；`ls` 会作为 `list` 的别名处理。返回值已深冻结。 */
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
  modules = freezeModules(deepClone(BUILTIN_MODULES) as ModuleDefinition[]);
  rebuildMap();
}
