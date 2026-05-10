import { ZentaoError } from '../misc/errors.js';
import { getGlobalOptions } from '../misc/global-options.js';
import type { RequestOptions, ResponseData } from '../types/index.js';
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
function normalizeResponse(command: ReturnType<typeof resolveModuleCommand>, raw: unknown, limit?: string): ResponseData {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { status: 'success', data: raw };
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
    data,
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
 */
export async function request(
  name: `${string}/${string}`,
  params: Record<string, unknown> = {},
  options: RequestOptions = {},
): Promise<ResponseData> {
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
    method: String(command.action.method).toUpperCase() as any,
    query: command.query,
    body: command.data,
    timeout: options.timeout ?? globals.timeout,
    insecure: options.insecure ?? globals.insecure,
  });

  return normalizeResponse(command, raw, options.limit ?? globals.limit);
}
