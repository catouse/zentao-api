import { ZentaoError } from '../misc/errors.js';
import { getGlobalOptions } from '../misc/global-options.js';
import type { HttpMethod, RequestOptions, ResponseData } from '../types/index.js';
import { getModule } from '../modules/registry.js';
import { extractPager, extractResult, resolveModuleCommand } from '../modules/resolve.js';

/** 将 `moduleName/methodName` 形式的请求名拆成模块名和动作名。 */
function splitRequestName(name: `${string}/${string}`): { moduleName: string; actionName: string } {
  const index = name.indexOf('/');
  if (index <= 0 || index === name.length - 1) {
    throw new ZentaoError('E_INVALID_REQUEST_NAME');
  }
  return {
    moduleName: name.slice(0, index),
    actionName: name.slice(index + 1),
  };
}

/** 将禅道原始响应归一化为稳定的 ResponseData 结构。 */
function normalizeResponse<T>(command: ReturnType<typeof resolveModuleCommand>, raw: unknown, limit?: string): ResponseData<T> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { status: 'success', data: raw as T };
  }

  const record = raw as Record<string, unknown>;
  const status = record.status === 'fail' ? 'fail' : 'success';
  let data = extractResult(command.action, record);
  const numericLimit = limit === undefined ? undefined : Number(limit);
  if (Array.isArray(data) && numericLimit !== undefined && !Number.isNaN(numericLimit)) {
    data = data.slice(0, numericLimit);
  }

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

  const { moduleName, actionName } = splitRequestName(name);
  const module = getModule(moduleName);
  // recPerPage 是最常用的列表参数，允许在全局或本次调用中统一覆盖。
  const recPerPage = params.recPerPage ?? options.recPerPage ?? globals.recPerPage;
  const mergedParams = recPerPage === undefined ? params : { ...params, recPerPage };
  const command = resolveModuleCommand(module, actionName, mergedParams);
  const raw = await client.request(command.path, {
    method: String(command.action.method).toUpperCase() as HttpMethod,
    query: command.query,
    body: command.data,
    timeout: options.timeout ?? globals.timeout,
    insecure: options.insecure ?? globals.insecure,
  });

  const response = normalizeResponse<T>(command, raw, options.limit ?? globals.limit);
  if (response.status === 'fail' && (options.throwOnFail ?? globals.throwOnFail)) {
    throw new ZentaoError('E_API_FAILED', { message: response.message ?? '' }, response);
  }
  return response;
}
