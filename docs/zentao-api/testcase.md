# 测试用例 (testcase)

测试用例管理，支持产品的用例模块树、创建测试用例、创建产品的用例模块、获取测试用例详情、修改测试用例、修改用例模块、删除测试用例、删除用例模块

## 动作概览

| SDK 动作 | 说明 | 方法 | 路径 |
| --- | --- | --- | --- |
| `list` | 产品的用例模块树 | `GET` | `/products/{productID}/testcase/modules` |
| `create` | 创建测试用例 | `POST` | `/testcases` |
| `create` | 创建产品的用例模块 | `POST` | `/products/{productID}/testcase/modules` |
| `get` | 获取测试用例详情 | `GET` | `/testcases/{caseID}` |
| `update` | 修改测试用例 | `PUT` | `/testcases/{caseID}` |
| `update` | 修改用例模块 | `PUT` | `/testcase/modules/{moduleID}` |
| `delete` | 删除测试用例 | `DELETE` | `/testcases/{caseID}` |
| `delete` | 删除用例模块 | `DELETE` | `/testcase/modules/{moduleID}` |

## 产品的用例模块树

- SDK 调用：`request("testcase/list", params)`
- HTTP：`GET /products/{productID}/testcase/modules`
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

const result = await request("testcase/list");
```
## 创建测试用例

- SDK 调用：`request("testcase/create", params)`
- HTTP：`POST /testcases`
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
      "description": "用例标题"
    },
    "module": {
      "type": "integer",
      "description": "所属模块",
      "format": "int32"
    },
    "story": {
      "type": "integer",
      "description": "相关需求",
      "format": "int32"
    },
    "pri": {
      "type": "integer",
      "description": "优先级",
      "format": "int32"
    },
    "type": {
      "type": "string",
      "description": "用例类型(unit 单元测试 | interface 接口测试 | feature 功能测试 | install 安装部署 | config 配置相关 | performance 性能测试 | security 安全相关 | other 其他)"
    },
    "precondition": {
      "type": "string",
      "description": "前置条件"
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "用例步骤, 如果是嵌套用例，可以通过key表示嵌套关系 {\"1\": \"分组1\", \"1.1\": \"子分组1.1\", \"1.1.1\": \"步骤1.1.1\"}"
    },
    "expects": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "用例步骤期望, 如果是嵌套用例步骤，可以通过key表示嵌套关系 {\"1\": \"\", \"1.1\": \"\", \"1.1.1\": \"步骤1.1.1的期望\"}"
    },
    "stepType": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "用例步骤类型(step 步骤 | group 父级步骤), 如果是嵌套用例步骤，可以通过key表示嵌套关系 {\"1\": \"group\", \"1.1\": \"group\", \"1.1.1\": \"step\"}"
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
    }
  },
  "required": [
    "productID",
    "title"
  ]
}
```

示例:

```json
{
  "productID": 1,
  "title": "<string>",
  "module": 1,
  "story": 1,
  "pri": 1,
  "type": "<string>",
  "precondition": "<string>",
  "steps": [
    "<string>"
  ],
  "expects": [
    "<string>"
  ],
  "stepType": [
    "<string>"
  ],
  "project": 1,
  "execution": 1
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("testcase/create", {
  "productID": 1,
  "title": "<string>",
  "module": 1,
  "story": 1,
  "pri": 1,
  "type": "<string>",
  "precondition": "<string>",
  "steps": [
    "<string>"
  ],
  "expects": [
    "<string>"
  ],
  "stepType": [
    "<string>"
  ],
  "project": 1,
  "execution": 1
});
```
## 创建产品的用例模块

- SDK 调用：`request("testcase/create", params)`
- HTTP：`POST /products/{productID}/testcase/modules`
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

const result = await request("testcase/create", {
  "productID": 1,
  "name": "<string>",
  "parentID": 1
});
```
## 获取测试用例详情

- SDK 调用：`request("testcase/get", params)`
- HTTP：`GET /testcases/{caseID}`
- 动作类型：`get`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `caseID` | 测试用例ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`object`
- 结果字段：`testcase`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("testcase/get", {
  "caseID": 1
});
```
## 修改测试用例

- SDK 调用：`request("testcase/update", params)`
- HTTP：`PUT /testcases/{caseID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `caseID` | 测试用例ID |

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
      "description": "用例标题"
    },
    "module": {
      "type": "integer",
      "description": "所属模块",
      "format": "int32"
    },
    "story": {
      "type": "integer",
      "description": "相关需求",
      "format": "int32"
    },
    "pri": {
      "type": "integer",
      "description": "优先级",
      "format": "int32"
    },
    "type": {
      "type": "string",
      "description": "用例类型(unit 单元测试 | interface 接口测试 | feature 功能测试 | install 安装部署 | config 配置相关 | performance 性能测试 | security 安全相关 | other 其他)"
    },
    "precondition": {
      "type": "string",
      "description": "前置条件"
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "用例步骤, 如果是嵌套用例，可以通过key表示嵌套关系 {\"1\": \"分组1\", \"1.1\": \"子分组1.1\", \"1.1.1\": \"步骤1.1.1\"}"
    },
    "expects": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "用例步骤期望, 如果是嵌套用例步骤，可以通过key表示嵌套关系 {\"1\": \"\", \"1.1\": \"\", \"1.1.1\": \"步骤1.1.1的期望\"}"
    },
    "stepType": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "用例步骤类型(step 步骤 | group 父级步骤), 如果是嵌套用例步骤，可以通过key表示嵌套关系 {\"1\": \"group\", \"1.1\": \"group\", \"1.1.1\": \"step\"}"
    }
  },
  "required": [
    "title"
  ]
}
```

示例:

```json
{
  "title": "<string>",
  "module": 1,
  "story": 1,
  "pri": 1,
  "type": "<string>",
  "precondition": "<string>",
  "steps": [
    "<string>"
  ],
  "expects": [
    "<string>"
  ],
  "stepType": [
    "<string>"
  ]
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("testcase/update", {
  "caseID": 1,
  "title": "<string>",
  "module": 1,
  "story": 1,
  "pri": 1,
  "type": "<string>",
  "precondition": "<string>",
  "steps": [
    "<string>"
  ],
  "expects": [
    "<string>"
  ],
  "stepType": [
    "<string>"
  ]
});
```
## 修改用例模块

- SDK 调用：`request("testcase/update", params)`
- HTTP：`PUT /testcase/modules/{moduleID}`
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

const result = await request("testcase/update", {
  "moduleID": 1,
  "name": "<string>",
  "parent": 1
});
```
## 删除测试用例

- SDK 调用：`request("testcase/delete", params)`
- HTTP：`DELETE /testcases/{caseID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `caseID` | 测试用例ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("testcase/delete", {
  "caseID": 1
});
```
## 删除用例模块

- SDK 调用：`request("testcase/delete", params)`
- HTTP：`DELETE /testcase/modules/{moduleID}`
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

const result = await request("testcase/delete", {
  "moduleID": 1
});
```
