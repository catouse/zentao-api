[zentao-api](../index.md) / defineModuleActions

# Function: defineModuleActions()

> **defineModuleActions**(`moduleName`, `input`): `void`

为已存在的模块追加或覆盖动作。

不做深度合并：同名动作整体替换，未知动作追加。这避免在 schema、参数数组等字段上出现隐式合并规则。

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `moduleName` | `string` | 目标模块名（大小写不敏感）。 |
| `input` | [`ModuleAction`](../interfaces/ModuleAction.md) \| [`ModuleAction`](../interfaces/ModuleAction.md)[] | 单个或一组动作定义。 |

## Returns

`void`

## Throws

`E_INVALID_MODULE`（模块未注册）或 `E_INVALID_ACTION_DEFINITION`
  （动作缺少 `name` / `path` / `method` 等必填字段）。
