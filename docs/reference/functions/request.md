[zentao-api](../index.md) / request

# Function: request()

## Call Signature

> **request**\<`Name`\>(`name`, `params?`, `options?`): `Promise`\<[`ResponseData`](../interfaces/ResponseData.md)\<[`RequestResultFor`](../type-aliases/RequestResultFor.md)\<`Name`\>\>\>

按模块名或模块动作名请求禅道 API。

选项优先级为：本次调用 options > 全局 options > 客户端默认值。
当响应 `status` 为 `"fail"` 时，默认按原样返回；若 `options.throwOnFail`
或全局 `throwOnFail` 为真，则改为抛出 `E_API_FAILED`。

### Type Parameters

| Type Parameter |
| ------ |
| `Name` *extends* [`BuiltinRequestName`](../type-aliases/BuiltinRequestName.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `Name` | 请求名，例如 `product`、`product/list` 或 `product/1`。 |
| `params?` | [`RequestParamsFor`](../type-aliases/RequestParamsFor.md)\<`Name`\> | 请求参数。 |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | 请求选项。 |

### Returns

`Promise`\<[`ResponseData`](../interfaces/ResponseData.md)\<[`RequestResultFor`](../type-aliases/RequestResultFor.md)\<`Name`\>\>\>

归一化后的禅道 API 响应。

### Throws

传输层错误、参数缺失或 `throwOnFail` 启用时的业务失败。

## Call Signature

> **request**\<`T`\>(`name`, `params?`, `options?`): `Promise`\<[`ResponseData`](../interfaces/ResponseData.md)\<`T`\>\>

按模块名或模块动作名请求禅道 API。

选项优先级为：本次调用 options > 全局 options > 客户端默认值。
当响应 `status` 为 `"fail"` 时，默认按原样返回；若 `options.throwOnFail`
或全局 `throwOnFail` 为真，则改为抛出 `E_API_FAILED`。

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `unknown` | 期望的 `data` 字段类型；不传时为 `unknown`，调用方需要自行收窄。 |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 请求名，例如 `product`、`product/list` 或 `product/1`。 |
| `params?` | `Record`\<`string`, `unknown`\> | 请求参数。 |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | 请求选项。 |

### Returns

`Promise`\<[`ResponseData`](../interfaces/ResponseData.md)\<`T`\>\>

归一化后的禅道 API 响应。

### Throws

传输层错误、参数缺失或 `throwOnFail` 启用时的业务失败。
