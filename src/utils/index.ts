import { ZentaoError } from '../misc/errors.js';

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
