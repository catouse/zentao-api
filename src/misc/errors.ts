export const ERRORS = {
  E_INVALID_BASE_URL: 'Invalid ZenTao baseUrl.',
  E_NO_GLOBAL_CLIENT: 'No global client configured. Call ZentaoClient.init() or pass options.client.',
  E_HTTP_ERROR: 'HTTP request failed: {status} {statusText}',
  E_NETWORK_ERROR: 'Network request failed: {message}',
  E_TIMEOUT: 'Request timed out.',
  E_INSECURE_BROWSER: 'The insecure option is only supported in Node.js runtimes.',
  E_LOGIN_FAILED: 'ZenTao login failed.',
  E_INVALID_PROFILE: 'Invalid ZenTao profile.',
  E_NO_PROFILE: 'No ZenTao profile is configured.',
  E_PROFILE_NOT_FOUND: 'ZenTao profile not found: {profileKey}',
  E_PROFILE_STORAGE_INVALID: 'ZenTao profile storage is not valid JSON.',
  E_PROFILE_STORAGE_UNAVAILABLE: 'ZenTao profile storage is unavailable in this runtime.',
  E_INVALID_MODULE: 'Unknown module: {module}',
  E_INVALID_ACTION: 'Unknown action: {module}-{action}',
  E_INVALID_MODULE_DEFINITION: 'Invalid module definition.',
  E_INVALID_ACTION_DEFINITION: 'Invalid module action definition.',
  E_MISSING_PARAM: 'Missing required parameter: {param}',
  E_INVALID_REQUEST_NAME: 'Request name must use the form "moduleName/methodName".',
} as const;

export type ErrorCode = keyof typeof ERRORS;

/** SDK 统一错误类型，所有可预期错误都会携带稳定错误码。 */
export class ZentaoError extends Error {
  /** 错误码，对应 {@link ERRORS} 的 key。 */
  readonly code: ErrorCode;
  /** 附加上下文，例如 HTTP 响应详情或原始异常。 */
  readonly details?: unknown;

  /** 根据错误码和占位符替换值创建错误。 */
  constructor(code: ErrorCode, replacements?: Record<string, string | number>, details?: unknown) {
    let message: string = ERRORS[code];
    if (replacements) {
      for (const [key, value] of Object.entries(replacements)) {
        message = message.replaceAll(`{${key}}`, String(value));
      }
    }
    super(message);
    this.name = 'ZentaoError';
    this.code = code;
    this.details = details;
  }
}
