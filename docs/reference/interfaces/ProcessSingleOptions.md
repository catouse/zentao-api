[zentao-api](../index.md) / ProcessSingleOptions

# Interface: ProcessSingleOptions

[processData](../functions/processData.md) 处理单条对象时的选项；执行顺序为 转换 → 摘取。

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-convert"></a> `convert?` | (`record`) => [`DataRecord`](../type-aliases/DataRecord.md) | 转换函数，用于对对象进行转换。 |
| <a id="property-pick"></a> `pick?` | `string`[] | 摘取字段路径列表。 |
