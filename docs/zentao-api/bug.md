# Bug (bug)

Bug管理，支持产品的Bug模块树、创建Bug、创建项目Bug、创建产品的Bug模块、获取Bug详情、修改Bug、修改Bug模块、删除Bug、删除Bug模块、激活Bug、关闭Bug、解决Bug

## 动作概览

| SDK 动作 | 说明 | 方法 | 路径 |
| --- | --- | --- | --- |
| `list` | 产品的Bug模块树 | `GET` | `/products/{productID}/bug/modules` |
| `create` | 创建Bug | `POST` | `/bugs` |
| `project-createBug` | 创建项目Bug | `POST` | `/projects/{projectID}/bugs` |
| `product-createBugModule` | 创建产品的Bug模块 | `POST` | `/products/{productID}/bug/modules` |
| `get` | 获取Bug详情 | `GET` | `/bugs/{bugID}` |
| `update` | 修改Bug | `PUT` | `/bugs/{bugID}` |
| `bug-updateModule` | 修改Bug模块 | `PUT` | `/bug/modules/{moduleID}` |
| `delete` | 删除Bug | `DELETE` | `/bugs/{bugID}` |
| `bug-deleteModule` | 删除Bug模块 | `DELETE` | `/bug/modules/{moduleID}` |
| `activate` | 激活Bug | `PUT` | `/bugs/{bugID}/activate` |
| `close` | 关闭Bug | `PUT` | `/bugs/{bugID}/close` |
| `resolve` | 解决Bug | `PUT` | `/bugs/{bugID}/resolve` |

## 产品的Bug模块树

- SDK 调用：`request("bug/list", params)`
- HTTP：`GET /products/{productID}/bug/modules`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/list");
```
## 创建Bug

- SDK 调用：`request("bug/create", params)`
- HTTP：`POST /bugs`
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
    "productID": {
      "type": "integer",
      "description": "所属产品",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "Bug标题"
    },
    "openedBuild": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "影响版本,主干是trunk，其他版本使用版本ID"
    },
    "project": {
      "type": "integer",
      "description": "所属项目",
      "format": "int32"
    },
    "execution": {
      "type": "integer",
      "description": "所属执行",
      "format": "int32"
    },
    "severity": {
      "type": "integer",
      "description": "严重程度，默认是3",
      "format": "int32"
    },
    "pri": {
      "type": "integer",
      "description": "优先级，默认是3",
      "format": "int32"
    },
    "type": {
      "type": "string",
      "description": "Bug类型(codeerror 代码错误 | config 配置相关 | install 安装部署 | security 安全相关 | performance 性能问题 | standard 标准规范 | automation 测试脚本 | designdefect 设计缺陷 | others 其他)"
    },
    "steps": {
      "type": "string",
      "description": "重现步骤"
    },
    "story": {
      "type": "integer",
      "description": "相关需求",
      "format": "int32"
    },
    "assignedTo": {
      "type": "string",
      "description": "指派给"
    }
  },
  "required": [
    "productID",
    "title",
    "openedBuild"
  ]
}
```

示例:

```json
{
  "productID": 1,
  "title": "<string>",
  "openedBuild": [
    "<string>"
  ],
  "project": 1,
  "execution": 1,
  "severity": 1,
  "pri": 1,
  "type": "<string>",
  "steps": "<string>",
  "story": 1,
  "assignedTo": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/create", {
  "productID": 1,
  "title": "<string>",
  "openedBuild": [
    "<string>"
  ],
  "project": 1,
  "execution": 1,
  "severity": 1,
  "pri": 1,
  "type": "<string>",
  "steps": "<string>",
  "story": 1,
  "assignedTo": "<string>"
});
```
## 创建项目Bug

- SDK 调用：`request("bug/project-createBug", params)`
- HTTP：`POST /projects/{projectID}/bugs`
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
    "productID": {
      "type": "integer",
      "description": "所属产品；项目型项目可不传，产品型项目必须传",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "Bug标题"
    },
    "openedBuild": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "影响版本，主干是trunk，其他版本使用版本ID"
    },
    "severity": {
      "type": "integer",
      "description": "严重程度",
      "format": "int32"
    },
    "pri": {
      "type": "integer",
      "description": "优先级",
      "format": "int32"
    },
    "type": {
      "type": "string",
      "description": "Bug类型"
    },
    "steps": {
      "type": "string",
      "description": "重现步骤"
    }
  },
  "required": [
    "title",
    "openedBuild"
  ]
}
```

示例:

```json
{
  "productID": 1,
  "title": "<string>",
  "openedBuild": [
    "<string>"
  ],
  "severity": 1,
  "pri": 1,
  "type": "<string>",
  "steps": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/project-createBug", {
  "projectID": 1,
  "productID": 1,
  "title": "<string>",
  "openedBuild": [
    "<string>"
  ],
  "severity": 1,
  "pri": 1,
  "type": "<string>",
  "steps": "<string>"
});
```
## 创建产品的Bug模块

- SDK 调用：`request("bug/product-createBugModule", params)`
- HTTP：`POST /products/{productID}/bug/modules`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `productID` | 产品ID |

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
      "description": "模块名称"
    },
    "parentID": {
      "type": "integer",
      "description": "父模块",
      "format": "int32"
    }
  }
}
```

示例:

```json
{
  "name": "<string>",
  "parentID": 1
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/product-createBugModule", {
  "productID": 1,
  "name": "<string>",
  "parentID": 1
});
```
## 获取Bug详情

- SDK 调用：`request("bug/get", params)`
- HTTP：`GET /bugs/{bugID}`
- 动作类型：`get`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `bugID` | Bug ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`object`
- 结果字段：`bug`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/get", {
  "bugID": 1
});
```
## 修改Bug

- SDK 调用：`request("bug/update", params)`
- HTTP：`PUT /bugs/{bugID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `bugID` | Bug ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Bug标题"
    },
    "severity": {
      "type": "integer",
      "description": "严重程度，默认是3",
      "format": "int32"
    },
    "pri": {
      "type": "integer",
      "description": "优先级，默认是3",
      "format": "int32"
    },
    "type": {
      "type": "string",
      "description": "Bug类型(codeerror 代码错误 | config 配置相关 | install 安装部署 | security 安全相关 | performance 性能问题 | standard 标准规范 | automation 测试脚本 | designdefect 设计缺陷 | others 其他)"
    },
    "openedBuild": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "影响版本,主干是trunk，其他版本使用版本ID"
    },
    "steps": {
      "type": "string",
      "description": "重现步骤"
    },
    "project": {
      "type": "integer",
      "description": "所属项目",
      "format": "int32"
    },
    "execution": {
      "type": "integer",
      "description": "所属执行",
      "format": "int32"
    },
    "story": {
      "type": "integer",
      "description": "相关需求",
      "format": "int32"
    },
    "assignedTo": {
      "type": "string",
      "description": "指派给"
    }
  }
}
```

示例:

```json
{
  "title": "<string>",
  "severity": 1,
  "pri": 1,
  "type": "<string>",
  "openedBuild": [
    "<string>"
  ],
  "steps": "<string>",
  "project": 1,
  "execution": 1,
  "story": 1,
  "assignedTo": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/update", {
  "bugID": 1,
  "title": "<string>",
  "severity": 1,
  "pri": 1,
  "type": "<string>",
  "openedBuild": [
    "<string>"
  ],
  "steps": "<string>",
  "project": 1,
  "execution": 1,
  "story": 1,
  "assignedTo": "<string>"
});
```
## 修改Bug模块

- SDK 调用：`request("bug/bug-updateModule", params)`
- HTTP：`PUT /bug/modules/{moduleID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `moduleID` | 模块ID |

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
      "description": "模块名称"
    },
    "parent": {
      "type": "integer",
      "description": "父模块",
      "format": "int32"
    }
  }
}
```

示例:

```json
{
  "name": "<string>",
  "parent": 1
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/bug-updateModule", {
  "moduleID": 1,
  "name": "<string>",
  "parent": 1
});
```
## 删除Bug

- SDK 调用：`request("bug/delete", params)`
- HTTP：`DELETE /bugs/{bugID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `bugID` | Bug ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/delete", {
  "bugID": 1
});
```
## 删除Bug模块

- SDK 调用：`request("bug/bug-deleteModule", params)`
- HTTP：`DELETE /bug/modules/{moduleID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `moduleID` | 模块ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/bug-deleteModule", {
  "moduleID": 1
});
```
## 激活Bug

- SDK 调用：`request("bug/activate", params)`
- HTTP：`PUT /bugs/{bugID}/activate`
- 动作类型：`action`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `bugID` | Bug ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "openedBuild": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "影响版本, trunk为主干"
    },
    "assignedTo": {
      "type": "string",
      "description": "指派给"
    },
    "comment": {
      "type": "string",
      "description": "备注"
    }
  }
}
```

示例:

```json
{
  "openedBuild": [
    "<string>"
  ],
  "assignedTo": "<string>",
  "comment": "<string>"
}
```

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/activate", {
  "bugID": 1,
  "openedBuild": [
    "<string>"
  ],
  "assignedTo": "<string>",
  "comment": "<string>"
});
```
## 关闭Bug

- SDK 调用：`request("bug/close", params)`
- HTTP：`PUT /bugs/{bugID}/close`
- 动作类型：`action`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `bugID` | Bug ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "comment": {
      "type": "string",
      "description": "备注"
    }
  }
}
```

示例:

```json
{
  "comment": "<string>"
}
```

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/close", {
  "bugID": 1,
  "comment": "<string>"
});
```
## 解决Bug

- SDK 调用：`request("bug/resolve", params)`
- HTTP：`PUT /bugs/{bugID}/resolve`
- 动作类型：`action`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `bugID` | Bug ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "resolution": {
      "type": "string",
      "description": "fixed 已解决 | notrepro 无法重现 | bydesign 设计如此 | duplicate 重复Bug | external 外部原因| postponed 延期处理 | willnotfix 不予解决 | tostory 转为需求"
    },
    "resolvedDate": {
      "type": "string",
      "description": "解决日期，默认今天"
    },
    "resolvedBuild": {
      "type": "string",
      "description": "解决版本, trunk为主干"
    },
    "assignedTo": {
      "type": "string",
      "description": "指派给"
    },
    "comment": {
      "type": "string",
      "description": "备注"
    }
  },
  "required": [
    "resolution"
  ]
}
```

示例:

```json
{
  "resolution": "<string>",
  "resolvedDate": "<string>",
  "resolvedBuild": "<string>",
  "assignedTo": "<string>",
  "comment": "<string>"
}
```

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("bug/resolve", {
  "bugID": 1,
  "resolution": "<string>",
  "resolvedDate": "<string>",
  "resolvedBuild": "<string>",
  "assignedTo": "<string>",
  "comment": "<string>"
});
```
