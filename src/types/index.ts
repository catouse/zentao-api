import type { ZentaoClient } from '../client/index.js';

/** 创建 {@link ZentaoClient} 时使用的配置。 */
export interface ZentaoClientOptions {
  /** 禅道站点根地址，例如 `https://zentao.example.com`；SDK 会自动拼接 `/api.php/v2`。 */
  baseUrl: string;
  /** 禅道 API Token；未提供时可稍后通过 {@link ZentaoClient.login} 获取并写入实例。 */
  token?: string;
  /** 默认请求超时时间，单位毫秒。 */
  timeout?: number;
  /** 是否跳过 TLS 证书验证；仅 Node.js 运行时支持，浏览器中会抛错。 */
  insecure?: boolean;
}

/** SDK 进程级全局默认选项，供高阶 {@link request} 调用复用。 */
export interface GlobalOptions {
  /** 默认客户端；通常由 `ZentaoClient.init()` 设置。 */
  client?: ZentaoClient;
  /** 默认每页记录数，会映射到模块动作的 `recPerPage` 参数。 */
  recPerPage?: string;
  /** 默认限制返回列表数量，只影响 SDK 归一化后的 `data`。 */
  limit?: string;
  /** 默认请求超时时间，优先级低于单次请求选项。 */
  timeout?: number;
  /** 默认 TLS 跳过证书验证选项；仅 Node.js 运行时支持。 */
  insecure?: boolean;
  /** 是否在登录成功后把账号、Token 和配置持久化为本地 profile。 */
  persistProfiles?: boolean;
  /** 当禅道服务端返回 `{ status: "fail" }` 时是否抛出 `E_API_FAILED`，默认 false。 */
  throwOnFail?: boolean;
}

/** SDK 支持的 HTTP 方法。 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** 请求体序列化方式。 */
export type ClientRequestBodyType = 'json' | 'form' | 'raw';

/** 响应体解析方式。 */
export type ClientResponseType = 'auto' | 'json' | 'text' | 'arrayBuffer' | 'blob' | 'response';

/** `ZentaoClient.request()` 的单次请求选项。 */
export interface ClientRequestOptions {
  /** HTTP 方法，默认 `GET`。 */
  method?: HttpMethod;
  /** 请求体；`GET` 请求会忽略该字段。普通对象默认按 JSON 发送，`FormData` / `Blob` / `ArrayBuffer` 等会原样发送。 */
  body?: unknown;
  /** 请求体序列化方式。默认 `json`；传入 `FormData` 等原生 body 时会自动按 `raw` 处理。 */
  bodyType?: ClientRequestBodyType;
  /** 响应体解析方式。默认 `auto`，会优先尝试 JSON，失败后回落为文本。 */
  responseType?: ClientResponseType;
  /** 额外请求头；会与 SDK 自动注入的 `Token` / `Content-Type` 合并。 */
  headers?: HeadersInit;
  /** URL 查询参数；`undefined` 值会被跳过。 */
  query?: Record<string, string | number | boolean | undefined>;
  /** 外部取消信号；会与 SDK 自身的超时控制合并。 */
  signal?: AbortSignal;
  /** 单次请求超时时间，优先级高于全局和客户端默认值。 */
  timeout?: number;
  /** 单次请求 TLS 跳过证书验证选项；仅 Node.js 运行时支持。 */
  insecure?: boolean;
}

/** 高阶 `request("moduleName")` / `request("moduleName/methodName")` / `request("moduleName/<objectID>")` 的单次调用选项。 */
export interface RequestOptions extends ProcessListOptions {
  /** 本次调用使用的客户端；优先级高于全局客户端。 */
  client?: ZentaoClient;
  /** 本次调用使用的每页记录数，优先级高于全局 `recPerPage`。 */
  recPerPage?: string;
  /** 本次调用超时时间。 */
  timeout?: number;
  /** 本次调用 TLS 跳过证书验证选项；仅 Node.js 运行时支持。 */
  insecure?: boolean;
  /**
   * 当禅道服务端返回 `{ status: "fail" }` 时是否抛出 `E_API_FAILED`。
   * 不传时回落到全局 `throwOnFail`，默认 false（保留原始失败响应）。
   */
  throwOnFail?: boolean;
}

/** 高阶 `request()` 归一化后的返回数据。 */
export interface ResponseData<T = unknown> {
  /** 禅道服务端状态；非标准响应会按成功响应包装到 `data`。 */
  status: 'success' | 'fail';
  /** 禅道服务端返回的消息。 */
  message?: string;
  /** 原始消息字段；当服务端返回对象/数组等非字符串消息时保留在这里。 */
  rawMessage?: unknown;
  /** 服务端返回的业务错误码或状态码字段。 */
  apiCode?: string | number;
  /** 失败响应的原始对象，便于上层展示服务端返回的完整上下文。 */
  raw?: Record<string, unknown>;
  /** 根据模块动作 `resultGetter` 提取后的业务数据。 */
  data?: T;
  /** 统一分页信息。 */
  pager?: {
    /** 总记录数。 */
    total: number;
    /** 当前页码。 */
    page: number;
    /** 每页记录数。 */
    recPerPage: number;
  };
}

/** 禅道 API 原始分页结构。 */
export interface Pager {
  /** 总记录数。 */
  recTotal: number;
  /** 每页记录数。 */
  recPerPage: number;
  /** 总页数，部分接口不返回。 */
  pageTotal?: number;
  /** 当前页码。 */
  pageID: number;
}

/** 禅道 API 通用响应结构，允许携带任意业务字段。 */
export interface ApiResponse {
  /** 服务端返回状态。 */
  status: 'success' | 'fail';
  /** 服务端消息，可能是字符串、对象或数组。 */
  message?: unknown;
  /** 其他业务字段。 */
  [key: string]: unknown;
}

/** 禅道 API 列表响应结构。 */
export interface ApiListResponse extends ApiResponse {
  /** 原始分页信息。 */
  pager?: Pager;
}

/** 登录接口响应结构。 */
export interface LoginResponse extends ApiResponse {
  /** 登录成功后返回的 API Token。 */
  token?: string;
  /** 部分禅道环境会随登录响应返回用户信息。 */
  user?: Record<string, unknown>;
  /** 部分禅道环境会随登录响应返回服务端配置。 */
  serverConfig?: ServerConfig;
}

/** 禅道 `?mode=getconfig` 返回的服务端配置。 */
export interface ServerConfig {
  version: string;
  systemMode: string;
  sprintConcept: string;
  requestType: string;
  requestFix: string;
  moduleVar: string;
  methodVar: string;
  viewVar: string;
  sessionVar: string;
}

/** 保存到本地 profile 中的客户端偏好配置。 */
export interface ZentaoProfileConfig {
  /** 默认输出格式，供 CLI 等上层应用复用。 */
  defaultOutputFormat?: 'markdown' | 'json' | 'raw';
  /** 界面语言。 */
  lang?: string;
  /** 默认分页大小。 */
  defaultRecPerPage?: number;
  /** 是否跳过 TLS 证书验证；仅 Node.js 运行时支持。 */
  insecure?: boolean;
  /** 请求超时时间，单位毫秒。 */
  timeout?: number;
  /** 是否在批量操作出错时停止执行后续操作。 */
  batchFailFast?: boolean;
  /** JSON 格式化时是否添加缩进。 */
  jsonPretty?: boolean;
  /** 模块级分页偏好。 */
  pagers?: Record<string, number>;
  /** 允许上层应用保存自定义配置。 */
  [key: string]: unknown;
}

/** 本地持久化的禅道账号 profile。 */
export interface ZentaoProfile {
  /** 禅道站点根地址，不包含 `/api.php/v2`。 */
  server: string;
  /** 用户账号。 */
  account: string;
  /** 禅道 API Token。 */
  token: string;
  /** 登录验证通过后得到的用户信息。 */
  user?: Record<string, unknown>;
  /** 登录时间。 */
  loginTime?: string;
  /** 最后使用时间。 */
  lastUsedTime?: string;
  /** 禅道服务端配置。 */
  serverConfig?: ServerConfig;
  /** 客户端自定义配置。 */
  config?: ZentaoProfileConfig;
  /** 允许上层应用保存额外字段。 */
  [key: string]: unknown;
}

/** 运行时返回的 profile，会额外带上 `account@server` 形式的 key。 */
export interface ZentaoProfileRecord extends ZentaoProfile {
  key: string;
}

/** 本地 profile 存储文件或浏览器 localStorage 中的 JSON 结构。 */
export interface ZentaoProfilesStore {
  /** 当前使用的 profile key。 */
  currentProfile?: string;
  /** 保存的 profile 列表。 */
  profiles: ZentaoProfile[];
}

/** 模块动作类型：基础 CRUD 或自定义动作。 */
export type ModuleActionType = 'list' | 'get' | 'create' | 'update' | 'delete' | 'action';
/** 模块动作使用的 HTTP 方法；兼容生成定义中的小写方法。 */
export type ModuleActionMethod = HttpMethod | Lowercase<HttpMethod>;
/** 模块动作名称，允许除基础动作外的自定义名称。 */
export type ModuleActionName = ModuleActionType | (string & {});
/** 模块动作参数可选项。 */
export type ModuleActionParamOption = { readonly value: unknown; readonly label: string };

/** 模块动作的查询参数定义。 */
export interface ModuleActionParam {
  /** 参数名称。 */
  name: string;
  /** 参数说明。 */
  description?: string;
  /** 是否必填。 */
  required?: boolean;
  /** 未显式传入时使用的默认值。 */
  defaultValue?: unknown;
  /** 参数值类型，用于基础类型转换。 */
  type?: 'string' | 'number' | 'boolean';
  /** 参数可选值。 */
  options?: readonly ModuleActionParamOption[];
}

/** 模块动作结果形态。 */
export type ModuleActionResultType = 'text' | 'object' | 'list';
/** 列表分页信息别名。 */
export type ListPagerInfo = Pager;

/** 模块动作请求体定义。 */
export interface ModuleActionRequestBody {
  /** 请求体类型。 */
  type?: 'object' | 'string';
  /** 请求体是否必填。 */
  required?: boolean;
  /** OpenAPI 风格 schema，用于从 params 组装 body。 */
  schema: Readonly<Record<string, unknown>>;
  /** 请求体示例。 */
  example?: unknown;
}

/** 模块动作响应定义。 */
export interface ModuleActionResponse {
  /** 响应说明。 */
  description?: string;
  /** 响应 schema。 */
  schema: Readonly<Record<string, unknown>>;
  /** 响应示例。 */
  example?: unknown;
}

/** 模块动作渲染目标类型；保留给 CLI 等上层应用使用。 */
export type ModuleActionResultRenderType = 'markdown' | 'json' | 'raw';
/** 模块动作自定义渲染函数类型；SDK 本身不直接渲染终端输出。 */
export type ModuleActionResultRender = (
  result: unknown,
  type: ModuleActionResultRenderType,
  action: ModuleAction,
) => string;

/** 从原始响应中提取分页字段时使用的字段映射。 */
export interface ModuleActionPagerGetterMap {
  /** 当前页码字段名。 */
  pageID: string;
  /** 每页记录数字段名。 */
  recPerPage: string;
  /** 总记录数字段名。 */
  recTotal: string;
}

/** 禅道模块中的单个 API 动作定义。 */
export interface ModuleAction {
  /** 动作名称，例如 `list`、`get`、`close`。 */
  name: ModuleActionName;
  /** 动作类型，决定高阶 request 的路径/参数解析策略。 */
  type: ModuleActionType;
  /** 面向用户展示的动作名称。 */
  display?: string;
  /** 动作说明。 */
  description?: string;
  /** HTTP 方法。 */
  method: ModuleActionMethod;
  /** API 路径模板，可包含 `{productID}` 等路径参数。 */
  path: string;
  /** 路径参数定义；字符串为说明，对象可携带默认值和可选项。 */
  pathParams?: Readonly<Record<string, string | Omit<ModuleActionParam, 'name'>>>;
  /** 查询参数定义。 */
  params?: readonly ModuleActionParam[];
  /** 请求体定义。 */
  requestBody?: ModuleActionRequestBody;
  /** 结果形态。 */
  resultType: ModuleActionResultType;
  /** 从原始响应中提取分页信息的位置或函数。 */
  pagerGetter?: string | ModuleActionPagerGetterMap | ((data: unknown, params: Record<string, unknown>) => ListPagerInfo);
  /** 从原始响应中提取业务数据的位置或函数。 */
  resultGetter?: string | Record<string, string> | ((data: unknown, params: Record<string, unknown>) => unknown);
  /** 供上层应用使用的渲染配置。 */
  render?: string | ModuleActionResultRender | Record<ModuleActionResultRenderType, ModuleActionResultRender>;
}

/** 内置模块名称，同时允许用户扩展自定义模块名。 */
export type ModuleName =
  | 'user'
  | 'program'
  | 'product'
  | 'project'
  | 'execution'
  | 'productplan'
  | 'story'
  | 'epic'
  | 'requirement'
  | 'bug'
  | 'testcase'
  | 'task'
  | 'feedback'
  | 'ticket'
  | 'system'
  | 'build'
  | 'testtask'
  | 'release'
  | 'file'
  | (string & {});

/** 禅道模块定义，由多个动作组成。 */
export interface ModuleDefinition {
  /** 模块名称，例如 `product`、`bug`。 */
  name: ModuleName;
  /** 面向用户展示的模块名称。 */
  display?: string;
  /** 模块说明。 */
  description?: string;
  /** 模块支持的动作集合。 */
  actions: readonly ModuleAction[];
}

/** 本地数据处理的基础记录类型，对应一条对象数据。 */
export type DataRecord = Record<string, unknown>;

/** 单条过滤条件，字段名支持 `.` 访问子字段。 */
export interface DataRecordFilter {
  /** 字段路径，例如 `status` 或 `assignedTo.id`。 */
  key: string;
  /** 比较运算符。 */
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | '~' | '!~';
  /** 比较值；数组用于 `=`/`!=`/`~`/`!~` 的“任一/全不”匹配。 */
  value: string | number | boolean | string[];
}

/** 一组过滤条件，组内按 `operator` 组合；多组之间按 AND 组合。 */
export interface DataRecordFilterGroup {
  /** 组内条件的组合方式。 */
  operator: 'AND' | 'OR';
  /** 组内条件列表。 */
  conditions: DataRecordFilter[];
}

/** 排序表达式，格式为 `字段:asc|desc`。 */
export type SortExpr = `${string}:${'asc' | 'desc'}`;

/** 自定义排序比较函数。 */
export type SortFn = (a: DataRecord, b: DataRecord) => number;

/** {@link processData} 处理列表时的选项；执行顺序为 过滤 → 搜索 → 排序 → 限制数量 → 摘取。 */
export interface ProcessListOptions {
  /** 过滤表达式列表，例如 `["status=active", "pri>=2"]`，多条之间按 AND 组合。 */
  filter?: string[];
  /** 模糊搜索关键词组，组内空格分隔为 OR，多组之间按 AND 组合。 */
  search?: string[];
  /** 限定搜索字段，缺省时搜索全部字段。 */
  searchFields?: string[];
  /** 排序表达式，多个字段以英文逗号分隔，例如 `pri:desc,id:asc`。 */
  sort?: string;
  /** 限制返回列表数量，在排序后、摘取前截断；不改变服务端页大小。 */
  limit?: string;
  /** 摘取字段路径列表。 */
  pick?: string[];
}

/** {@link processData} 处理单条对象时的选项。 */
export interface ProcessSingleOptions {
  /** 摘取字段路径列表。 */
  pick?: string[];
}

/** 将模块动作和参数解析后的可执行请求描述。 */
export interface ResolvedModuleCommand {
  /** 模块名称。 */
  module: string;
  /** 匹配到的动作定义。 */
  action: ModuleAction;
  /** 原始调用参数。 */
  params: Record<string, unknown>;
  /** 已替换路径参数后的 API 路径。 */
  path: string;
  /** 已组装的查询参数。 */
  query?: Record<string, string | number>;
  /** 已组装的请求体。 */
  data?: Record<string, unknown>;
  /** 从 `id` 或 `{module}ID` 推断出的对象 ID。 */
  id?: number;
}
