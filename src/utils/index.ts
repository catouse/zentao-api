import { ZentaoError } from '../misc/errors.js';

/** 判断值是否为普通对象（非数组、非 null）。 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** 将用户传入的站点根地址规范化，兼容误传入 `/api.php/v2` 的场景。 */
export function normalizeSiteUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  if (!trimmed) throw new ZentaoError('E_INVALID_BASE_URL');
  return trimmed.replace(/\/api\.php\/v2$/i, '');
}

export function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
