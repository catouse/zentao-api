[zentao-api](../index.md) / ProcessListOptions

# Interface: ProcessListOptions

[processData](../functions/processData.md) 处理列表时的选项；执行顺序为 转换 → 过滤 → 搜索 → 排序 → 限制数量 → 摘取。

## Extended by

- [`RequestOptions`](RequestOptions.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-convert"></a> `convert?` | (`records`) => [`DataRecord`](../type-aliases/DataRecord.md)[] | 列表转换函数，在过滤前对记录数组整体执行。 |
| <a id="property-filter"></a> `filter?` | `string`[] | 过滤表达式组，如 `["status=active,pri>=2", "assignedTo.id=5"]`；组内 AND、组间 OR，`=` 与 `:` 均表示相等。 |
| <a id="property-limit"></a> `limit?` | `string` | 限制返回列表数量，在排序后、摘取前截断；不改变服务端页大小。 |
| <a id="property-pick"></a> `pick?` | `string`[] | 摘取字段路径列表。 |
| <a id="property-search"></a> `search?` | `string`[] | 模糊搜索关键词组，如 `["登录,超时", "注册,失败"]`；组内 AND、组间 OR。 |
| <a id="property-searchfields"></a> `searchFields?` | `string`[] | 限定搜索字段，缺省时搜索全部字段。 |
| <a id="property-sort"></a> `sort?` | `string` | 排序表达式，多个字段以英文逗号分隔；推荐 `pri:desc,id:asc`，兼容 `pri_desc,id_asc`。 |
