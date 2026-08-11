[zentao-api](../index.md) / searchData

# Function: searchData()

> **searchData**(`data`, `keywordGroups`, `searchFields?`): [`DataRecord`](../type-aliases/DataRecord.md)[]

对列表做大小写不敏感的模糊匹配。

每个 `keywordGroups` 元素是一个关键词组，组内以逗号分隔为 AND；多个组之间按 OR 组合。
引号内的逗号视为关键词内容，不作为分隔符。

## Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`DataRecord`](../type-aliases/DataRecord.md)[] |
| `keywordGroups` | `string`[] |
| `searchFields?` | `string`[] |

## Returns

[`DataRecord`](../type-aliases/DataRecord.md)[]
