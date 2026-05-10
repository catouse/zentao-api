export { ZentaoClient } from './client/index.js';
export { ERRORS, ZentaoError, type ErrorCode } from './misc/errors.js';
export { getGlobalOptions, setGlobalOptions } from './misc/global-options.js';
export {
  defineModuleActions,
  defineModules,
  type DefineModulesOptions,
  getModule,
  getModuleAction,
} from './modules/registry.js';
export { request } from './request/index.js';
export { BUILD, VERSION } from './version.js';
export type {
  ApiListResponse,
  ApiResponse,
  ClientRequestOptions,
  GlobalOptions,
  HttpMethod,
  ListPagerInfo,
  LoginResponse,
  ModuleAction,
  ModuleActionMethod,
  ModuleActionName,
  ModuleActionPagerGetterMap,
  ModuleActionParam,
  ModuleActionParamOption,
  ModuleActionRequestBody,
  ModuleActionResponse,
  ModuleActionResultRender,
  ModuleActionResultRenderType,
  ModuleActionResultType,
  ModuleActionType,
  ModuleDefinition,
  ModuleName,
  Pager,
  RequestOptions,
  ResolvedModuleCommand,
  ResponseData,
  ServerConfig,
  ZentaoClientOptions,
} from './types/index.js';
