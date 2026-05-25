import { ZentaoError } from '../misc/errors.js';
import { assertInsecureSupported, fetchWithInsecureTls } from '../misc/environment.js';
import { getGlobalOptions, setGlobalOptions } from '../misc/global-options.js';
import { addProfile, switchProfile } from '../profiles/index.js';
import { isRecord, normalizeSiteUrl } from '../utils/index.js';
import type {
  ClientRequestOptions,
  HttpMethod,
  LoginResponse,
  ServerConfig,
  ZentaoClientOptions,
  ZentaoProfileConfig,
} from '../types/index.js';

const DEFAULT_TIMEOUT = 10000;

/** 拼接 API 路径与查询参数，跳过值为 `undefined` 的查询项。 */
function buildUrl(baseUrl: string, path: string, query?: ClientRequestOptions['query']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/** 优先解析 JSON；非 JSON 响应保留为原始文本。 */
async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text === '') return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


/**
 * 禅道 API 客户端，封装一次次原始 HTTP 调用。
 *
 * 主要职责：
 * - 站点根地址规范化与 `/api.php/v2` 拼接
 * - 自动注入 `Token` 头
 * - 请求超时控制（基于 {@link AbortController}）
 * - 可选的 TLS 跳过校验（仅 Node.js 运行时）
 * - 响应体的 JSON 解析与错误归一化
 *
 * 适合直接调用裸 API；若希望按模块/动作名调用并自动组装路径、参数、分页，
 * 请改用 {@link request}。
 */
export class ZentaoClient {
  /** 禅道站点根地址，不包含 `/api.php/v2`。 */
  readonly siteUrl: string;
  /** 禅道 API v2 根地址，等于 `siteUrl + '/api.php/v2'`。 */
  readonly baseUrl: string;
  private token?: string;
  private readonly timeout?: number;
  private readonly insecure?: boolean;

  /**
   * 使用完整配置创建客户端。
   *
   * @param options - 客户端配置，参见 {@link ZentaoClientOptions}。
   * @throws {ZentaoError} `E_INVALID_BASE_URL` —— `baseUrl` 无法解析为合法的 http(s) URL。
   */
  constructor(options: ZentaoClientOptions);
  /**
   * 使用站点根地址创建客户端。
   *
   * @param baseUrl - 禅道站点根地址，例如 `https://zentao.example.com`；
   *   若误传 `/api.php/v2` 后缀会自动剥离。
   * @throws {ZentaoError} `E_INVALID_BASE_URL` —— 地址不合法或协议非 http(s)。
   */
  constructor(baseUrl: string);
  constructor(input: ZentaoClientOptions | string) {
    const options = typeof input === 'string' ? { baseUrl: input } : input;
    this.siteUrl = normalizeSiteUrl(options.baseUrl);
    this.baseUrl = `${this.siteUrl}/api.php/v2`;
    this.token = options.token;
    this.timeout = options.timeout;
    this.insecure = options.insecure;
  }

  /**
   * 发起一次原始 API 请求。
   *
   * 选项优先级：本次调用 `options` > 全局选项（{@link getGlobalOptions}） > 客户端构造时默认值。
   *
   * 特殊处理：
   * - 默认 HTTP 方法为 `GET`，`GET` 请求即使提供了 `options.body` 也不会发送，避免被部分代理/浏览器拒绝。
   * - 非空响应优先按 JSON 解析；解析失败时回落为字符串原文。
   * - 业务层失败（即响应体 `{ status: "fail" }`）不会抛出，仍按原样返回；只有 HTTP/网络/超时等传输层错误才会抛错。
   * - `insecure` 仅在 Node.js 下可用，浏览器中传入会抛 `E_INSECURE_BROWSER`。
   *
   * @param path - 相对 {@link baseUrl} 的路径，可省略前导 `/`。
   * @param options - 单次请求选项，参见 {@link ClientRequestOptions}。
   * @returns 解析后的响应体；当响应为空字符串时返回 `undefined`。
   * @throws {ZentaoError} 可能抛出 `E_HTTP_ERROR`（非 2xx 状态）、`E_NETWORK_ERROR`（底层 fetch 失败）、
   *   `E_TIMEOUT`（超过 `timeout`）或 `E_INSECURE_BROWSER`（浏览器中开启了 `insecure`）。
   */
  async request(path: string, options: ClientRequestOptions = {}): Promise<unknown> {
    const globals = getGlobalOptions();
    const method: HttpMethod = options.method ?? 'GET';
    const timeout = options.timeout ?? globals.timeout ?? this.timeout ?? DEFAULT_TIMEOUT;
    const insecure = options.insecure ?? globals.insecure ?? this.insecure;
    assertInsecureSupported(insecure);
    const url = buildUrl(this.baseUrl, path, options.query);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Token = this.token;
    }

    const init: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };
    // GET 请求不携带 body，避免浏览器和部分代理拒绝请求。
    if (options.body !== undefined && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetchWithInsecureTls(insecure, url, init);
      if (!response.ok) {
        throw new ZentaoError('E_HTTP_ERROR', {
          status: response.status,
          statusText: response.statusText,
        }, {
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          body: await response.text().catch(() => undefined),
        });
      }
      return parseResponse(response);
    } catch (error) {
      if (error instanceof ZentaoError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ZentaoError('E_TIMEOUT');
      }
      throw new ZentaoError('E_NETWORK_ERROR', { message: (error as Error).message ?? String(error) }, error);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 发起 `GET` 请求。
   *
   * @typeParam T - 期望的响应体类型；调用方负责类型收窄，SDK 不做运行时校验。
   * @param path - 相对 {@link baseUrl} 的路径。
   * @returns 解析后的响应体（强转为 `T`）。
   * @throws {ZentaoError} 传输层失败时抛出，详见 {@link ZentaoClient.request}。
   */
  async get<T>(path: string): Promise<T> {
    return this.request(path, { method: 'GET' }) as Promise<T>;
  }

  /**
   * 发起 `POST` 请求，`body` 会被序列化为 JSON。
   *
   * @typeParam T - 期望的响应体类型。
   * @param path - 相对 {@link baseUrl} 的路径。
   * @param body - JSON 请求体，传入对象/数组将被 `JSON.stringify`。
   * @returns 解析后的响应体（强转为 `T`）。
   * @throws {ZentaoError} 传输层失败时抛出，详见 {@link ZentaoClient.request}。
   */
  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request(path, { method: 'POST', body }) as Promise<T>;
  }

  /**
   * 发起 `PUT` 请求，`body` 会被序列化为 JSON。
   *
   * @typeParam T - 期望的响应体类型。
   * @param path - 相对 {@link baseUrl} 的路径。
   * @param body - JSON 请求体。
   * @returns 解析后的响应体（强转为 `T`）。
   * @throws {ZentaoError} 传输层失败时抛出，详见 {@link ZentaoClient.request}。
   */
  async put<T>(path: string, body: unknown): Promise<T> {
    return this.request(path, { method: 'PUT', body }) as Promise<T>;
  }

  /**
   * 发起 `DELETE` 请求。
   *
   * @typeParam T - 期望的响应体类型。
   * @param path - 相对 {@link baseUrl} 的路径。
   * @returns 解析后的响应体（强转为 `T`）。
   * @throws {ZentaoError} 传输层失败时抛出，详见 {@link ZentaoClient.request}。
   */
  async delete<T>(path: string): Promise<T> {
    return this.request(path, { method: 'DELETE' }) as Promise<T>;
  }

  /**
   * 使用账号密码登录禅道。
   *
   * 成功后会把返回的 Token 写入当前客户端实例（后续请求自动带上 `Token` 头）；
   * 当全局 `persistProfiles` 为真时，会同时把账号、Token、用户信息、服务端配置和
   * 客户端偏好（仅在显式设置过 `timeout` / `insecure` 时）持久化为本地 profile，
   * 并切换为当前 profile，方便下次通过 {@link ZentaoClient.fromProfile} 直接登录态恢复。
   *
   * @param account - 禅道用户账号。
   * @param password - 禅道用户密码（明文，仅在传输层 TLS 内使用）。
   * @returns 登录成功后返回的 API Token。
   * @throws {ZentaoError} `E_LOGIN_FAILED` —— 服务端返回 `status !== "success"` 或缺失 token；
   *   也可能因底层 {@link ZentaoClient.request} 而抛出 HTTP/网络/超时错误。
   */
  async login(account: string, password: string): Promise<string> {
    const response = await this.post<LoginResponse>('/users/login', { account, password });
    if (response.status !== 'success' || !response.token) {
      throw new ZentaoError('E_LOGIN_FAILED');
    }
    this.token = response.token;
    const globals = getGlobalOptions();
    if (globals.persistProfiles) {
      const config: ZentaoProfileConfig = {};
      const timeout = this.timeout ?? globals.timeout;
      const insecure = this.insecure ?? globals.insecure;
      if (timeout !== undefined) config.timeout = timeout;
      if (insecure !== undefined) config.insecure = insecure;

      await addProfile({
        server: this.siteUrl,
        account,
        token: response.token,
        user: isRecord(response.user) ? response.user : undefined,
        serverConfig: isRecord(response.serverConfig) ? response.serverConfig as ServerConfig : undefined,
        config: Object.keys(config).length > 0 ? config : undefined,
      });
    }
    return response.token;
  }

  /**
   * 创建客户端实例，语义等同于 `new ZentaoClient(options)`，便于链式调用。
   *
   * @param options - 客户端配置，参见 {@link ZentaoClientOptions}。
   * @returns 新建的客户端实例。
   * @throws {ZentaoError} 同 {@link ZentaoClient | 构造函数}：`E_INVALID_BASE_URL` 等。
   */
  static create(options: ZentaoClientOptions): ZentaoClient {
    return new ZentaoClient(options);
  }

  /**
   * 创建客户端并写入全局选项，作为 {@link request} 默认使用的实例。
   *
   * 适合应用入口处一次性完成初始化，后续 `request("module/action", params)` 可省略 `options.client`。
   * 多次调用会覆盖上一次的全局客户端。
   *
   * @param options - 客户端配置，参见 {@link ZentaoClientOptions}。
   * @returns 新建并已注册为全局默认的客户端实例。
   * @throws {ZentaoError} 同 {@link ZentaoClient | 构造函数}：`E_INVALID_BASE_URL` 等。
   */
  static init(options: ZentaoClientOptions): ZentaoClient {
    const client = new ZentaoClient(options);
    setGlobalOptions({ client });
    return client;
  }

  /**
   * 根据本地持久化 profile 创建客户端。
   *
   * 实际会调用 {@link switchProfile}：若 `profileKey` 存在则刷新其 `lastUsedTime` 并设为当前 profile；
   * 不传 `profileKey` 时使用当前 profile。Profile 中保存的 `timeout` / `insecure` 偏好也会被带回到客户端实例。
   *
   * @param profileKey - 可选的 profile key，格式为 `account@server`；不传时使用当前 profile。
   * @returns 用 profile 还原后的客户端实例。
   * @throws {ZentaoError} `E_NO_PROFILE`（无任何 profile 且未传 key）、`E_PROFILE_NOT_FOUND`（指定 key 不存在）、
   *   `E_PROFILE_STORAGE_UNAVAILABLE`（运行时无法访问持久化存储）。
   */
  static async fromProfile(profileKey?: string): Promise<ZentaoClient> {
    // switchProfile 会在内部读取存储、校验 key 并刷新 lastUsedTime 后写回，
    // 若 key 不存在会抛出 E_PROFILE_NOT_FOUND；不传 key 时由 switchCurrentProfile 处理。
    const activeProfile = await switchProfile(profileKey);
    return new ZentaoClient({
      baseUrl: activeProfile.server,
      token: activeProfile.token,
      timeout: typeof activeProfile.config?.timeout === 'number' ? activeProfile.config.timeout : undefined,
      insecure: typeof activeProfile.config?.insecure === 'boolean' ? activeProfile.config.insecure : undefined,
    });
  }
}
