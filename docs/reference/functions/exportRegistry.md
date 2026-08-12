[zentao-api](../index.md) / exportRegistry

# Function: exportRegistry()

## Call Signature

> **exportRegistry**(`options`): `Record`\<`string`, [`ModuleDefinition`](../interfaces/ModuleDefinition.md)\>

导出注册表。

默认会把动作的 `requestBody` 转换成扁平的 `bodyParams`；传入 `raw: true`
时则保留原始模块结构。默认还会递归移除函数属性，以便安全地序列化为 JSON；
如需保留函数，可传入 `jsonSafe: false`。

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ExportRegistryOptions`](../interfaces/ExportRegistryOptions.md) & `object` | 导出选项。 |

### Returns

`Record`\<`string`, [`ModuleDefinition`](../interfaces/ModuleDefinition.md)\>

以模块名为键的模块定义。

## Call Signature

> **exportRegistry**(`options?`): `Record`\<`string`, [`ExportedModuleDefinition`](../type-aliases/ExportedModuleDefinition.md)\>

导出注册表。

默认会把动作的 `requestBody` 转换成扁平的 `bodyParams`；传入 `raw: true`
时则保留原始模块结构。默认还会递归移除函数属性，以便安全地序列化为 JSON；
如需保留函数，可传入 `jsonSafe: false`。

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`ExportRegistryOptions`](../interfaces/ExportRegistryOptions.md) & `object` | 导出选项。 |

### Returns

`Record`\<`string`, [`ExportedModuleDefinition`](../type-aliases/ExportedModuleDefinition.md)\>

以模块名为键的模块定义。

## Call Signature

> **exportRegistry**(`options`): `Record`\<`string`, [`ModuleDefinition`](../interfaces/ModuleDefinition.md) \| [`ExportedModuleDefinition`](../type-aliases/ExportedModuleDefinition.md)\>

导出注册表。

默认会把动作的 `requestBody` 转换成扁平的 `bodyParams`；传入 `raw: true`
时则保留原始模块结构。默认还会递归移除函数属性，以便安全地序列化为 JSON；
如需保留函数，可传入 `jsonSafe: false`。

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ExportRegistryOptions`](../interfaces/ExportRegistryOptions.md) | 导出选项。 |

### Returns

`Record`\<`string`, [`ModuleDefinition`](../interfaces/ModuleDefinition.md) \| [`ExportedModuleDefinition`](../type-aliases/ExportedModuleDefinition.md)\>

以模块名为键的模块定义。
