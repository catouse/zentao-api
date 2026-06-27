import { ZentaoError } from '../misc/errors.js';
import type { ModuleAction, ModuleDefinition } from '../types/index.js';
import { asArray } from '../utils/index.js';
import { BUILTIN_MODULES } from './generated.js';

export { BUILTIN_MODULES };
export const MODULES = BUILTIN_MODULES;

/** {@link defineModules} 的选项。 */
export interface DefineModulesOptions {
  /**
   * 同名模块的写入策略。
   *
   * - `false`（默认）：合并模块的元数据，并按动作名对动作做"同名替换、未知追加"。
   * - `true`：整体替换已存在的模块定义，原有动作会被丢弃。
   */
  replace?: boolean;
}

// 运行时注册表存放「深克隆 + 深冻结」后的模块定义：
// - 深克隆：避免用户后续修改自己的输入对象时污染注册表；
// - 深冻结：让 getModule / getModuleAction 可以零拷贝返回引用，
//   外部尝试改写会在严格模式下抛 TypeError，开销也降到 O(1) 查询。
let modules = freezeModules(cloneBuiltinModules());
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

function cloneBuiltinModules(): ModuleDefinition[] {
  return deepClone(BUILTIN_MODULES) as unknown as ModuleDefinition[];
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

/**
 * 注册或扩展模块定义。
 *
 * 行为细节：
 * - 模块名匹配大小写不敏感。
 * - 未知模块直接追加到注册表末尾。
 * - 已存在的模块默认按 `mergeModule` 合并：模块元数据浅合并、动作按名同名替换/未知追加；
 *   `options.replace` 为 `true` 时整体替换。
 * - 所有写入都会做深克隆 + 深冻结：调用方后续修改自己的对象不会污染注册表，注册表也不可被外部改写。
 *
 * @param input - 单个或一组模块定义。
 * @param options - 写入策略，参见 {@link DefineModulesOptions}。
 * @throws {ZentaoError} `E_INVALID_MODULE_DEFINITION` —— 缺少 `name` 或 `actions` 字段。
 */
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

/**
 * 为已存在的模块追加或覆盖动作。
 *
 * 不做深度合并：同名动作整体替换，未知动作追加。这避免在 schema、参数数组等字段上出现隐式合并规则。
 *
 * @param moduleName - 目标模块名（大小写不敏感）。
 * @param input - 单个或一组动作定义。
 * @throws {ZentaoError} `E_INVALID_MODULE`（模块未注册）或 `E_INVALID_ACTION_DEFINITION`
 *   （动作缺少 `name` / `path` / `method` 等必填字段）。
 */
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

/**
 * 获取模块定义。
 *
 * 模块名匹配大小写不敏感。返回值是注册表内部的已深冻结引用（O(1) 查询、零拷贝），
 * 任何写入尝试在严格模式下会抛 `TypeError`；如需修改请使用 {@link defineModules}。
 *
 * @param moduleName - 模块名。
 * @returns 已注册的模块定义。
 * @throws {ZentaoError} `E_INVALID_MODULE` —— 模块未注册。
 */
export function getModule(moduleName: string): ModuleDefinition {
  const module = moduleMap.get(moduleName.toLowerCase());
  if (!module) {
    throw new ZentaoError('E_INVALID_MODULE', { module: moduleName });
  }
  return module;
}

/**
 * 获取指定模块下的某个动作。
 *
 * 解析顺序：
 * 1. `actionName === 'ls'` 时映射为 `list`（仅作为别名，不会修改注册表）。
 * 2. 在该模块的动作中按名称大小写不敏感匹配。
 * 3. 当请求的动作不是基础 CRUD（`list`/`get`/`create`/`update`/`delete`）时，
 *    额外允许命中 `type === 'action'` 的自定义动作（即使名字不在基础 CRUD 中）。
 *
 * 返回值同样是已深冻结的引用，请勿尝试修改。
 *
 * @param moduleName - 模块名（大小写不敏感）。
 * @param actionName - 动作名（大小写不敏感）；支持 `ls` 作为 `list` 的别名。
 * @returns 匹配到的动作定义。
 * @throws {ZentaoError} `E_INVALID_MODULE`（模块未注册）或 `E_INVALID_ACTION`（动作不存在）。
 */
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

/**
 * 返回当前运行时注册表中的所有模块名。
 *
 * 顺序与模块写入注册表的顺序一致；包括内置模块和通过 {@link defineModules} 追加的用户模块。
 *
 * @returns 模块名数组（保留原始大小写）。
 */
export function getModuleNames(): string[] {
  return modules.map((module) => module.name);
}

/**
 * 判断模块名是否已注册。
 *
 * @param moduleName - 模块名；匹配大小写不敏感。
 * @returns 已注册返回 `true`，否则 `false`。
 */
export function isModuleName(moduleName: string): boolean {
  return moduleMap.has(moduleName.toLowerCase());
}

/** @internal */
export function resetModuleDefinitions(): void {
  modules = freezeModules(cloneBuiltinModules());
  rebuildMap();
}
