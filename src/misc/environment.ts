import { ZentaoError } from './errors.js';

/** 判断当前运行时是否为 Node.js。 */
export function isNodeRuntime(): boolean {
  return typeof process !== 'undefined' && Boolean(process.versions?.node);
}

/** 浏览器无法跳过 TLS 校验，因此在发起请求前提前失败。 */
export function assertInsecureSupported(enabled: boolean | undefined): void {
  if (enabled && !isNodeRuntime()) {
    throw new ZentaoError('E_INSECURE_BROWSER');
  }
}

/** 在 Node.js 中临时关闭 TLS 校验，并在本次请求结束后恢复原值。 */
export async function withInsecureTls<T>(enabled: boolean | undefined, fn: () => Promise<T>): Promise<T> {
  if (!enabled) return fn();
  assertInsecureSupported(enabled);

  const previous = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    return await fn();
  } finally {
    if (previous === undefined) {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    } else {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = previous;
    }
  }
}
