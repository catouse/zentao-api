# 项目 (project)

项目管理，支持获取项目列表、获取项目团队列表、创建项目、关闭项目、修改项目、删除项目、维护项目成员

## 动作概览

| SDK 动作 | 说明 | 方法 | 路径 |
| --- | --- | --- | --- |
| `list` | 获取项目列表 | `GET` | `/projects` |
| `list` | 获取项目团队列表 | `GET` | `/projects/team` |
| `create` | 创建项目 | `POST` | `/projects` |
| `create` | 关闭项目 | `POST` | `/projects/{projectID}/close` |
| `update` | 修改项目 | `PUT` | `/projects/{projectID}` |
| `delete` | 删除项目 | `DELETE` | `/projects/{projectID}` |
| `members` | 维护项目成员 | `PUT` | `/projects/{projectID}/members` |

## 获取项目列表

- SDK 调用：`request("project/list", params)`
- HTTP：`GET /projects`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `browseType` | string | 否 | `undone` | 项目状态，默认是undone<br>`all` 全部<br>`undone` 未完成<br>`wait` 未开始<br>`doing` 进行中 |
| `orderBy` | string | 否 |  | 排序<br>`id_asc` ID 升序<br>`id_desc` ID 降序<br>`name_asc` 名称 升序<br>`name_desc` 名称 降序<br>`begin_asc` 计划开始 升序<br>`begin_desc` 计划开始 降序<br>`end_asc` 计划结束 升序<br>`end_desc` 计划结束 降序 |
| `recPerPage` | number | 否 |  | 每页数量，不超过1000 |
| `pageID` | number | 否 |  | 页码，从第1页开始 |
| `filters` | string | 否 |  | 搜索条件数组，每项包含 field/operator/value/join/group；field 必须是该接口支持的搜索字段，operator 使用该接口搜索配置支持的操作符。支持搜索字段：name(项目名称，示例：关键字)；code(项目代号，示例：关键字)；id(项目ID，示例：1)；model(项目管理方式，枚举：scrum Scrum \| waterfall 瀑布 \| kanban 看板 \| agileplus 融合敏捷 \| waterfallplus 融合瀑布)；hasProduct(项目类型，枚举：1 产品型 \| 0 项目型)；parent(所属项目集，示例：all)；status(状态，枚举：wait 未开始 \| doing 进行中 \| suspended 已挂起 \| closed 已关闭 \| delay 已延期)；desc(项目描述，示例：关键字)；PM(负责人，用户，示例：admin)；openedDate(创建日期，示例：2026-01-01)；begin(计划开始，示例：2026-01-01)；end(计划完成，示例：2026-01-01)；realBegan(实际开始，示例：2026-01-01)；realEnd(实际完成，示例：2026-01-01)；openedBy(由谁创建，用户，示例：admin)；closedBy(由谁关闭，用户，示例：admin)；lastEditedDate(最后编辑日期，示例：2026-01-01)；closedDate(关闭日期，示例：2026-01-01) |
| `groupJoin` | string | 否 |  | 条件组之间的连接方式<br>`and` and<br>`or` or |

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`projects`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/list", {
  "browseType": "undone",
  "orderBy": "id_asc",
  "recPerPage": 1,
  "pageID": 1,
  "filters": "<string>",
  "groupJoin": "and"
});
```
## 获取项目团队列表

- SDK 调用：`request("project/list", params)`
- HTTP：`GET /projects/team`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `projectID` | string | 是 |  | 项目ID |

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`members`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/list", {
  "projectID": "<string>"
});
```
## 创建项目

- SDK 调用：`request("project/create", params)`
- HTTP：`POST /projects`
- 动作类型：`create`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "项目名称"
    },
    "model": {
      "type": "string",
      "description": "项目管理方式(scrum 敏捷 | waterfall 瀑布 | kanban 看板 | agileplus 融合敏捷 | waterfallplus 融合瀑布)"
    },
    "begin": {
      "type": "string",
      "description": "开始日期"
    },
    "end": {
      "type": "string",
      "description": "结束日期"
    },
    "products": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "关联产品"
    },
    "parent": {
      "type": "integer",
      "description": "所属项目集",
      "format": "int32"
    },
    "workflowGroup": {
      "type": "integer",
      "description": "项目流程，付费版功能，开源版可以不填",
      "format": "int32"
    },
    "PM": {
      "type": "string",
      "description": "项目负责人"
    }
  },
  "required": [
    "name",
    "model",
    "begin",
    "end",
    "workflowGroup"
  ]
}
```

示例:

```json
{
  "name": "<string>",
  "model": "<string>",
  "begin": "<string>",
  "end": "<string>",
  "products": [
    "<string>"
  ],
  "parent": 1,
  "workflowGroup": 1,
  "PM": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/create", {
  "name": "<string>",
  "model": "<string>",
  "begin": "<string>",
  "end": "<string>",
  "products": [
    "<string>"
  ],
  "parent": 1,
  "workflowGroup": 1,
  "PM": "<string>"
});
```
## 关闭项目

- SDK 调用：`request("project/create", params)`
- HTTP：`POST /projects/{projectID}/close`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `projectID` | 项目ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "realEnd": {
      "type": "string",
      "description": "实际完成日期"
    },
    "comment": {
      "type": "string",
      "description": "备注"
    }
  },
  "required": [
    "realEnd"
  ]
}
```

示例:

```json
{
  "realEnd": "<string>",
  "comment": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/create", {
  "projectID": 1,
  "realEnd": "<string>",
  "comment": "<string>"
});
```
## 修改项目

- SDK 调用：`request("project/update", params)`
- HTTP：`PUT /projects/{projectID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `projectID` | 项目ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "项目名称"
    },
    "model": {
      "type": "string",
      "description": "项目管理方式(scrum 敏捷 | waterfall 瀑布 | kanban 看板 | agileplus 融合敏捷 | waterfallplus 融合瀑布)"
    },
    "begin": {
      "type": "string",
      "description": "开始日期"
    },
    "end": {
      "type": "string",
      "description": "结束日期"
    },
    "products": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "关联产品"
    },
    "parent": {
      "type": "integer",
      "description": "所属项目集",
      "format": "int32"
    },
    "workflowGroup": {
      "type": "integer",
      "description": "项目流程，付费版功能，开源版可以不填",
      "format": "int32"
    },
    "PM": {
      "type": "string",
      "description": "项目负责人"
    }
  },
  "required": [
    "name",
    "model",
    "begin",
    "end",
    "workflowGroup"
  ]
}
```

示例:

```json
{
  "name": "<string>",
  "model": "<string>",
  "begin": "<string>",
  "end": "<string>",
  "products": [
    "<string>"
  ],
  "parent": 1,
  "workflowGroup": 1,
  "PM": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/update", {
  "projectID": 1,
  "name": "<string>",
  "model": "<string>",
  "begin": "<string>",
  "end": "<string>",
  "products": [
    "<string>"
  ],
  "parent": 1,
  "workflowGroup": 1,
  "PM": "<string>"
});
```
## 删除项目

- SDK 调用：`request("project/delete", params)`
- HTTP：`DELETE /projects/{projectID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `projectID` | 项目ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/delete", {
  "projectID": 1
});
```
## 维护项目成员

- SDK 调用：`request("project/members", params)`
- HTTP：`PUT /projects/{projectID}/members`
- 动作类型：`action`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `projectID` | 项目ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "account": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "成员账号，多人时按顺序设置。例如 account=[\"admin\",\"dev1\"] 时，role[0] 对应 admin，role[1] 对应 dev1"
    },
    "role": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "成员角色，与account顺序一一对应"
    },
    "days": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "可用工作日，与account顺序一一对应"
    },
    "hours": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "每日工时，与account顺序一一对应"
    },
    "limited": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "是否限制日期，与account顺序一一对应"
    }
  },
  "required": [
    "account"
  ]
}
```

示例:

```json
{
  "account": [
    "<string>"
  ],
  "role": [
    "<string>"
  ],
  "days": [
    "<string>"
  ],
  "hours": [
    "<string>"
  ],
  "limited": [
    "<string>"
  ]
}
```

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("project/members", {
  "projectID": 1,
  "account": [
    "<string>"
  ],
  "role": [
    "<string>"
  ],
  "days": [
    "<string>"
  ],
  "hours": [
    "<string>"
  ],
  "limited": [
    "<string>"
  ]
});
```
