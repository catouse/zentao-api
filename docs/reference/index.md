# zentao-api

## Classes

| Class | Description |
| ------ | ------ |
| [ZentaoClient](classes/ZentaoClient.md) | 禅道 API 客户端，封装一次次原始 HTTP 调用。 |
| [ZentaoError](classes/ZentaoError.md) | SDK 统一错误类型。 |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ApiListResponse](interfaces/ApiListResponse.md) | 禅道 API 列表响应结构。 |
| [ApiResponse](interfaces/ApiResponse.md) | 禅道 API 通用响应结构，允许携带任意业务字段。 |
| [ClientRequestOptions](interfaces/ClientRequestOptions.md) | `ZentaoClient.request()` 的单次请求选项。 |
| [DefineModulesOptions](interfaces/DefineModulesOptions.md) | [defineModules](functions/defineModules.md) 的选项。 |
| [GlobalOptions](interfaces/GlobalOptions.md) | SDK 进程级全局默认选项，供高阶 [request](functions/request.md) 调用复用。 |
| [LoginResponse](interfaces/LoginResponse.md) | 登录接口响应结构。 |
| [ModuleAction](interfaces/ModuleAction.md) | 禅道模块中的单个 API 动作定义。 |
| [ModuleActionPagerGetterMap](interfaces/ModuleActionPagerGetterMap.md) | 从原始响应中提取分页字段时使用的字段映射。 |
| [ModuleActionParam](interfaces/ModuleActionParam.md) | 模块动作的查询参数定义。 |
| [ModuleActionRequestBody](interfaces/ModuleActionRequestBody.md) | 模块动作请求体定义。 |
| [ModuleActionResponse](interfaces/ModuleActionResponse.md) | 模块动作响应定义。 |
| [ModuleDefinition](interfaces/ModuleDefinition.md) | 禅道模块定义，由多个动作组成。 |
| [Pager](interfaces/Pager.md) | 禅道 API 原始分页结构。 |
| [RequestOptions](interfaces/RequestOptions.md) | 高阶 `request("moduleName/methodName")` 的单次调用选项。 |
| [ResolvedModuleCommand](interfaces/ResolvedModuleCommand.md) | 将模块动作和参数解析后的可执行请求描述。 |
| [ResponseData](interfaces/ResponseData.md) | 高阶 `request()` 归一化后的返回数据。 |
| [ServerConfig](interfaces/ServerConfig.md) | 禅道 `?mode=getconfig` 返回的服务端配置。 |
| [ZentaoClientOptions](interfaces/ZentaoClientOptions.md) | 创建 [ZentaoClient](classes/ZentaoClient.md) 时使用的配置。 |
| [ZentaoProfile](interfaces/ZentaoProfile.md) | 本地持久化的禅道账号 profile。 |
| [ZentaoProfileConfig](interfaces/ZentaoProfileConfig.md) | 保存到本地 profile 中的客户端偏好配置。 |
| [ZentaoProfileRecord](interfaces/ZentaoProfileRecord.md) | 运行时返回的 profile，会额外带上 `account@server` 形式的 key。 |
| [ZentaoProfilesStore](interfaces/ZentaoProfilesStore.md) | 本地 profile 存储文件或浏览器 localStorage 中的 JSON 结构。 |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ErrorCode](type-aliases/ErrorCode.md) | SDK 已知错误码，对应 [ERRORS](variables/ERRORS.md) 的 key。 |
| [HttpMethod](type-aliases/HttpMethod.md) | SDK 支持的 HTTP 方法。 |
| [ListPagerInfo](type-aliases/ListPagerInfo.md) | 列表分页信息别名。 |
| [ModuleActionMethod](type-aliases/ModuleActionMethod.md) | 模块动作使用的 HTTP 方法；兼容生成定义中的小写方法。 |
| [ModuleActionName](type-aliases/ModuleActionName.md) | 模块动作名称，允许除基础动作外的自定义名称。 |
| [ModuleActionParamOption](type-aliases/ModuleActionParamOption.md) | 模块动作参数可选项。 |
| [ModuleActionResultRender](type-aliases/ModuleActionResultRender.md) | 模块动作自定义渲染函数类型；SDK 本身不直接渲染终端输出。 |
| [ModuleActionResultRenderType](type-aliases/ModuleActionResultRenderType.md) | 模块动作渲染目标类型；保留给 CLI 等上层应用使用。 |
| [ModuleActionResultType](type-aliases/ModuleActionResultType.md) | 模块动作结果形态。 |
| [ModuleActionType](type-aliases/ModuleActionType.md) | 模块动作类型：基础 CRUD 或自定义动作。 |
| [ModuleName](type-aliases/ModuleName.md) | 内置模块名称，同时允许用户扩展自定义模块名。 |

## Variables

| Variable | Description |
| ------ | ------ |
| [BUILD](variables/BUILD.md) | 构建标识，由构建脚本通过 `__ZENTAO_API_BUILD__` 注入。 |
| [ERRORS](variables/ERRORS.md) | SDK 已知错误码到默认消息的映射表。 |
| [VERSION](variables/VERSION.md) | SDK 版本号，由构建脚本通过 `__ZENTAO_API_VERSION__` 注入。 |
| [ZENTAO\_PROFILES\_STORAGE\_KEY](variables/ZENTAO_PROFILES_STORAGE_KEY.md) | 浏览器环境下用于在 `localStorage` 中保存 profile 数据的 key。 |

## Functions

| Function | Description |
| ------ | ------ |
| [addProfile](functions/addProfile.md) | 添加或覆盖一个本地 profile，并把它设置为当前使用的 profile。 |
| [defineModuleActions](functions/defineModuleActions.md) | 为已存在的模块追加或覆盖动作。 |
| [defineModules](functions/defineModules.md) | 注册或扩展模块定义。 |
| [deleteProfile](functions/deleteProfile.md) | 删除指定 profile。 |
| [getAllProfiles](functions/getAllProfiles.md) | 列出本地保存的所有 profile。 |
| [getGlobalOptions](functions/getGlobalOptions.md) | 获取当前全局选项的快照。 |
| [getModule](functions/getModule.md) | 获取模块定义。 |
| [getModuleAction](functions/getModuleAction.md) | 获取指定模块下的某个动作。 |
| [getProfile](functions/getProfile.md) | 获取指定 profile。 |
| [getProfileKey](functions/getProfileKey.md) | 根据 profile 的账号和禅道站点地址生成稳定 key。 |
| [request](functions/request.md) | 按模块动作名请求禅道 API。 |
| [setGlobalOptions](functions/setGlobalOptions.md) | 以浅合并的方式更新全局选项。 |
| [switchProfile](functions/switchProfile.md) | 切换当前使用的 profile，并刷新其 `lastUsedTime`。 |
