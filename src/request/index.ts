import { ZentaoError } from '../misc/errors.js';
import { getGlobalOptions } from '../misc/global-options.js';
import type { DataRecord, HttpMethod, ProcessListOptions, RequestOptions, ResponseData } from '../types/index.js';
import { getModule } from '../modules/registry.js';
import { extractPager, extractResult, resolveModuleCommand } from '../modules/resolve.js';
import { isRecord, processData } from '../utils/index.js';

/** 将 `moduleName/methodName` 形式的请求名拆成模块名和动作名。 */
function splitRequestName(name: string): { moduleName: string; actionName: string, id?: number } {
  const [moduleName, actionName] = name.split('/');

  // 如果没有指定 actionName
  if (!actionName?.length) {
    return {
      moduleName,
      actionName: 'list',
    }
  }

  // 如果 actionName 为数值
  if (Number.isInteger(Number(actionName))) {
    return {
      moduleName,
      actionName: 'get',
      id: Number(actionName),
    }
  }
  return {
    moduleName,
    actionName,
  };
}

/** 判断本次调用是否携带了需要本地处理列表的选项。 */
function hasListProcessing(options: ProcessListOptions): boolean {
  return Boolean(
    (options.filter && options.filter.length > 0) ||
    (options.search && options.search.length > 0) ||
    options.sort ||
    options.limit ||
    (options.pick && options.pick.length > 0),
  );
}

/**
 * 对归一化后的业务数据应用本地处理（过滤 → 搜索 → 排序 → 限制数量 → 摘取）。
 *
 * - 对象列表：交由 {@link processData} 完整处理。
 * - 基本类型数组：仅 `limit` 生效（按数量截断），避免破坏原始元素。
 * - 单条对象：只有 `pick` 生效。
 * - 其他形态原样返回。
 */
function applyProcessing(data: unknown, options: ProcessListOptions): unknown {
  if (Array.isArray(data)) {
    if (!hasListProcessing(options)) return data;
    if (data.every(isRecord)) {
      return processData(data as DataRecord[], {
        filter: options.filter,
        search: options.search,
        searchFields: options.searchFields,
        sort: options.sort,
        limit: options.limit,
        pick: options.pick,
      });
    }
    // 非对象数组（如 ID 列表）只能按数量截断，其余处理不适用。
    const limit = Number(options.limit);
    return Number.isFinite(limit) && limit >= 0 ? data.slice(0, Math.floor(limit)) : data;
  }
  if (isRecord(data) && options.pick && options.pick.length > 0) {
    return processData(data, { pick: options.pick });
  }
  return data;
}

/** 将禅道原始响应归一化为稳定的 ResponseData 结构。 */
function normalizeResponse<T>(
  command: ReturnType<typeof resolveModuleCommand>,
  raw: unknown,
  options: ProcessListOptions,
): ResponseData<T> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { status: 'success', data: raw as T };
  }

  const record = raw as Record<string, unknown>;
  const status = record.status === 'fail' ? 'fail' : 'success';
  const data = applyProcessing(extractResult(command.action, record), options);

  const pager = extractPager(command.action, record);
  return {
    status,
    message: typeof record.message === 'string' ? record.message : undefined,
    data: data as T,
    pager: pager ? {
      total: Number(pager.recTotal),
      page: Number(pager.pageID),
      recPerPage: Number(pager.recPerPage),
    } : undefined,
  };
}

/**
 * 按模块动作名请求禅道 API。
 *
 * 选项优先级为：本次调用 options > 全局 options > 客户端默认值。
 * 当响应 `status` 为 `"fail"` 时，默认按原样返回；若 `options.throwOnFail`
 * 或全局 `throwOnFail` 为真，则改为抛出 `E_API_FAILED`。
 *
 * @typeParam T 期望的 `data` 字段类型；不传时为 `unknown`，调用方需要自行收窄。
 * @param name - 模块动作名，例如 `product/list`。
 * @param params - 请求参数。
 * @param options - 请求选项。
 * @returns 归一化后的禅道 API 响应。
 * @throws {ZentaoError} 传输层错误、参数缺失或 `throwOnFail` 启用时的业务失败。
 */
export async function request<T = unknown>(
  name: `${string}/${string}`,
  params: Record<string, unknown> = {},
  options: RequestOptions = {},
): Promise<ResponseData<T>> {
  const globals = getGlobalOptions();
  const client = options.client ?? globals.client;
  if (!client) {
    throw new ZentaoError('E_NO_GLOBAL_CLIENT');
  }

  const { moduleName, actionName, id } = splitRequestName(name);
  const module = getModule(moduleName);
  // recPerPage 是最常用的列表参数，允许在全局或本次调用中统一覆盖。
  const recPerPage = params.recPerPage ?? options.recPerPage ?? globals.recPerPage;
  const mergedParams = {
    ...(id !== undefined ? { id } : {}),
    ...params,
    ...(recPerPage !== undefined ? { recPerPage } : {}),
  };
  const command = resolveModuleCommand(module, actionName, mergedParams);
  const raw = await client.request(command.path, {
    method: String(command.action.method).toUpperCase() as HttpMethod,
    query: command.query,
    body: command.data,
    timeout: options.timeout ?? globals.timeout,
    insecure: options.insecure ?? globals.insecure,
  });

  // limit 现归入本地处理选项；本次调用优先，缺省回落到全局默认。
  const processOptions: ProcessListOptions = { ...options, limit: options.limit ?? globals.limit };
  const response = normalizeResponse<T>(command, raw, processOptions);
  if (response.status === 'fail' && (options.throwOnFail ?? globals.throwOnFail)) {
    throw new ZentaoError('E_API_FAILED', { message: response.message ?? '' }, response);
  }
  return response;
}
