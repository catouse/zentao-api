# 文档 (doc)

文档管理，支持获取我的文档空间列表、获取团队文档空间列表、获取产品文档空间列表、获取项目文档空间列表、获取我的文档库列表、获取团队文档库列表、获取产品文档库列表、获取项目文档库列表、获取我的文档列表、获取团队文档列表、获取产品文档列表、获取项目文档列表、获取我的文档库目录列表、获取团队文档库目录列表、获取产品文档库目录列表、获取项目文档库目录列表、创建我的文档空间、创建团队文档空间、创建我的文档库、创建团队文档库、创建产品文档库、创建项目文档库、创建我的文档、创建团队文档、创建产品文档、创建项目文档、创建我的文档库目录、创建团队文档库目录、创建产品文档库目录、创建项目文档库目录、获取文档空间详情、获取文档库详情、获取文档详情、修改文档空间、修改文档库、修改文档、修改文档库目录、删除文档空间、删除文档库、删除文档、删除文档库目录

## 动作概览

| SDK 动作 | 说明 | 方法 | 路径 |
| --- | --- | --- | --- |
| `doc-mySpaces` | 获取我的文档空间列表 | `GET` | `/doc/my/spaces` |
| `doc-teamSpaces` | 获取团队文档空间列表 | `GET` | `/doc/team/spaces` |
| `doc-productSpaces` | 获取产品文档空间列表 | `GET` | `/doc/product/spaces` |
| `doc-projectSpaces` | 获取项目文档空间列表 | `GET` | `/doc/project/spaces` |
| `doc-myLibs` | 获取我的文档库列表 | `GET` | `/doc/my/spaces/{spaceID}/libs` |
| `doc-teamLibs` | 获取团队文档库列表 | `GET` | `/doc/team/spaces/{spaceID}/libs` |
| `doc-productLibs` | 获取产品文档库列表 | `GET` | `/doc/product/spaces/{productID}/libs` |
| `doc-projectLibs` | 获取项目文档库列表 | `GET` | `/doc/project/spaces/{projectID}/libs` |
| `doc-myDocs` | 获取我的文档列表 | `GET` | `/doc/my/spaces/{spaceID}/libs/{libID}/docs` |
| `doc-teamDocs` | 获取团队文档列表 | `GET` | `/doc/team/spaces/{spaceID}/libs/{libID}/docs` |
| `doc-productDocs` | 获取产品文档列表 | `GET` | `/doc/product/spaces/{productID}/libs/{libID}/docs` |
| `doc-projectDocs` | 获取项目文档列表 | `GET` | `/doc/project/spaces/{projectID}/libs/{libID}/docs` |
| `doc-myModules` | 获取我的文档库目录列表 | `GET` | `/doc/my/spaces/{spaceID}/libs/{libID}/modules` |
| `doc-teamModules` | 获取团队文档库目录列表 | `GET` | `/doc/team/spaces/{spaceID}/libs/{libID}/modules` |
| `doc-productModules` | 获取产品文档库目录列表 | `GET` | `/doc/product/spaces/{productID}/libs/{libID}/modules` |
| `doc-projectModules` | 获取项目文档库目录列表 | `GET` | `/doc/project/spaces/{projectID}/libs/{libID}/modules` |
| `doc-createMySpace` | 创建我的文档空间 | `POST` | `/doc/my/spaces` |
| `doc-createTeamSpace` | 创建团队文档空间 | `POST` | `/doc/team/spaces` |
| `doc-createMyLib` | 创建我的文档库 | `POST` | `/doc/my/spaces/{spaceID}/libs` |
| `doc-createTeamLib` | 创建团队文档库 | `POST` | `/doc/team/spaces/{spaceID}/libs` |
| `doc-createProductLib` | 创建产品文档库 | `POST` | `/doc/product/spaces/{productID}/libs` |
| `doc-createProjectLib` | 创建项目文档库 | `POST` | `/doc/project/spaces/{projectID}/libs` |
| `doc-createMyDoc` | 创建我的文档 | `POST` | `/doc/my/spaces/{spaceID}/libs/{libID}/docs` |
| `doc-createTeamDoc` | 创建团队文档 | `POST` | `/doc/team/spaces/{spaceID}/libs/{libID}/docs` |
| `doc-createProductDoc` | 创建产品文档 | `POST` | `/doc/product/spaces/{productID}/libs/{libID}/docs` |
| `doc-createProjectDoc` | 创建项目文档 | `POST` | `/doc/project/spaces/{projectID}/libs/{libID}/docs` |
| `doc-createMyModule` | 创建我的文档库目录 | `POST` | `/doc/my/spaces/{spaceID}/libs/{libID}/modules` |
| `doc-createTeamModule` | 创建团队文档库目录 | `POST` | `/doc/team/spaces/{spaceID}/libs/{libID}/modules` |
| `doc-createProductModule` | 创建产品文档库目录 | `POST` | `/doc/product/spaces/{productID}/libs/{libID}/modules` |
| `doc-createProjectModule` | 创建项目文档库目录 | `POST` | `/doc/project/spaces/{projectID}/libs/{libID}/modules` |
| `doc-getSpace` | 获取文档空间详情 | `GET` | `/doc/spaces/{spaceID}` |
| `doc-getLib` | 获取文档库详情 | `GET` | `/doc/libs/{libID}` |
| `get` | 获取文档详情 | `GET` | `/doc/docs/{docID}` |
| `doc-updateSpace` | 修改文档空间 | `PUT` | `/doc/spaces/{spaceID}` |
| `doc-updateLib` | 修改文档库 | `PUT` | `/doc/libs/{libID}` |
| `update` | 修改文档 | `PUT` | `/doc/docs/{docID}` |
| `doc-updateModule` | 修改文档库目录 | `PUT` | `/doc/modules/{moduleID}` |
| `doc-deleteSpace` | 删除文档空间 | `DELETE` | `/doc/spaces/{spaceID}` |
| `doc-deleteLib` | 删除文档库 | `DELETE` | `/doc/libs/{libID}` |
| `delete` | 删除文档 | `DELETE` | `/doc/docs/{docID}` |
| `doc-deleteModule` | 删除文档库目录 | `DELETE` | `/doc/modules/{moduleID}` |

## 获取我的文档空间列表

- SDK 调用：`request("doc/doc-mySpaces", params)`
- HTTP：`GET /doc/my/spaces`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`spaces`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-mySpaces");
```
## 获取团队文档空间列表

- SDK 调用：`request("doc/doc-teamSpaces", params)`
- HTTP：`GET /doc/team/spaces`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`spaces`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-teamSpaces");
```
## 获取产品文档空间列表

- SDK 调用：`request("doc/doc-productSpaces", params)`
- HTTP：`GET /doc/product/spaces`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`spaces`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-productSpaces");
```
## 获取项目文档空间列表

- SDK 调用：`request("doc/doc-projectSpaces", params)`
- HTTP：`GET /doc/project/spaces`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`spaces`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-projectSpaces");
```
## 获取我的文档库列表

- SDK 调用：`request("doc/doc-myLibs", params)`
- HTTP：`GET /doc/my/spaces/{spaceID}/libs`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`libs`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-myLibs");
```
## 获取团队文档库列表

- SDK 调用：`request("doc/doc-teamLibs", params)`
- HTTP：`GET /doc/team/spaces/{spaceID}/libs`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`libs`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-teamLibs");
```
## 获取产品文档库列表

- SDK 调用：`request("doc/doc-productLibs", params)`
- HTTP：`GET /doc/product/spaces/{productID}/libs`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`libs`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-productLibs");
```
## 获取项目文档库列表

- SDK 调用：`request("doc/doc-projectLibs", params)`
- HTTP：`GET /doc/project/spaces/{projectID}/libs`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`libs`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-projectLibs");
```
## 获取我的文档列表

- SDK 调用：`request("doc/doc-myDocs", params)`
- HTTP：`GET /doc/my/spaces/{spaceID}/libs/{libID}/docs`
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

const result = await request("doc/doc-myDocs");
```
## 获取团队文档列表

- SDK 调用：`request("doc/doc-teamDocs", params)`
- HTTP：`GET /doc/team/spaces/{spaceID}/libs/{libID}/docs`
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

const result = await request("doc/doc-teamDocs");
```
## 获取产品文档列表

- SDK 调用：`request("doc/doc-productDocs", params)`
- HTTP：`GET /doc/product/spaces/{productID}/libs/{libID}/docs`
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

const result = await request("doc/doc-productDocs");
```
## 获取项目文档列表

- SDK 调用：`request("doc/doc-projectDocs", params)`
- HTTP：`GET /doc/project/spaces/{projectID}/libs/{libID}/docs`
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

const result = await request("doc/doc-projectDocs");
```
## 获取我的文档库目录列表

- SDK 调用：`request("doc/doc-myModules", params)`
- HTTP：`GET /doc/my/spaces/{spaceID}/libs/{libID}/modules`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`modules`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-myModules");
```
## 获取团队文档库目录列表

- SDK 调用：`request("doc/doc-teamModules", params)`
- HTTP：`GET /doc/team/spaces/{spaceID}/libs/{libID}/modules`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`modules`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-teamModules");
```
## 获取产品文档库目录列表

- SDK 调用：`request("doc/doc-productModules", params)`
- HTTP：`GET /doc/product/spaces/{productID}/libs/{libID}/modules`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`modules`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-productModules");
```
## 获取项目文档库目录列表

- SDK 调用：`request("doc/doc-projectModules", params)`
- HTTP：`GET /doc/project/spaces/{projectID}/libs/{libID}/modules`
- 动作类型：`list`

### 路径参数

无路径参数。

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`list`
- 结果字段：`modules`
- 分页字段：`pager`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-projectModules");
```
## 创建我的文档空间

- SDK 调用：`request("doc/doc-createMySpace", params)`
- HTTP：`POST /doc/my/spaces`
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
      "description": "文档空间名称"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createMySpace", {
  "name": "<string>"
});
```
## 创建团队文档空间

- SDK 调用：`request("doc/doc-createTeamSpace", params)`
- HTTP：`POST /doc/team/spaces`
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
      "description": "文档空间名称"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createTeamSpace", {
  "name": "<string>"
});
```
## 创建我的文档库

- SDK 调用：`request("doc/doc-createMyLib", params)`
- HTTP：`POST /doc/my/spaces/{spaceID}/libs`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |

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
      "description": "文档库名称"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createMyLib", {
  "spaceID": 1,
  "name": "<string>"
});
```
## 创建团队文档库

- SDK 调用：`request("doc/doc-createTeamLib", params)`
- HTTP：`POST /doc/team/spaces/{spaceID}/libs`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |

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
      "description": "文档库名称"
    },
    "acl": {
      "type": "string",
      "description": "open 公开 | private 私有，默认是open"
    },
    "groups": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些权限分组可以访问"
    },
    "users": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些用户可以访问"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createTeamLib", {
  "spaceID": 1,
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
});
```
## 创建产品文档库

- SDK 调用：`request("doc/doc-createProductLib", params)`
- HTTP：`POST /doc/product/spaces/{productID}/libs`
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
      "description": "文档库名称"
    },
    "acl": {
      "type": "string",
      "description": "default 默认产品权限 | private 私有"
    },
    "groups": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些权限分组可以访问"
    },
    "users": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些用户可以访问"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createProductLib", {
  "productID": 1,
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
});
```
## 创建项目文档库

- SDK 调用：`request("doc/doc-createProjectLib", params)`
- HTTP：`POST /doc/project/spaces/{projectID}/libs`
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
    "name": {
      "type": "string",
      "description": "文档库名称"
    },
    "acl": {
      "type": "string",
      "description": "default 默认项目权限 | private 私有"
    },
    "groups": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些权限分组可以访问"
    },
    "users": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些用户可以访问"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createProjectLib", {
  "projectID": 1,
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
});
```
## 创建我的文档

- SDK 调用：`request("doc/doc-createMyDoc", params)`
- HTTP：`POST /doc/my/spaces/{spaceID}/libs/{libID}/docs`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |
| `libID` | 文档库ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "moduleID": {
      "type": "integer",
      "description": "所属目录",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "文档标题"
    },
    "content": {
      "type": "string",
      "description": "文档内容，支持HTML标签"
    }
  },
  "required": [
    "title",
    "content"
  ]
}
```

示例:

```json
{
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createMyDoc", {
  "spaceID": 1,
  "libID": 1,
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
});
```
## 创建团队文档

- SDK 调用：`request("doc/doc-createTeamDoc", params)`
- HTTP：`POST /doc/team/spaces/{spaceID}/libs/{libID}/docs`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |
| `libID` | 文档库ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "moduleID": {
      "type": "integer",
      "description": "所属目录",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "文档标题"
    },
    "content": {
      "type": "string",
      "description": "文档内容，支持HTML标签"
    }
  },
  "required": [
    "title",
    "content"
  ]
}
```

示例:

```json
{
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createTeamDoc", {
  "spaceID": 1,
  "libID": 1,
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
});
```
## 创建产品文档

- SDK 调用：`request("doc/doc-createProductDoc", params)`
- HTTP：`POST /doc/product/spaces/{productID}/libs/{libID}/docs`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `productID` | 产品ID |
| `libID` | 文档库ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "moduleID": {
      "type": "integer",
      "description": "所属目录",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "文档标题"
    },
    "content": {
      "type": "string",
      "description": "文档内容，支持HTML标签"
    }
  },
  "required": [
    "title",
    "content"
  ]
}
```

示例:

```json
{
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createProductDoc", {
  "productID": 1,
  "libID": 1,
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
});
```
## 创建项目文档

- SDK 调用：`request("doc/doc-createProjectDoc", params)`
- HTTP：`POST /doc/project/spaces/{projectID}/libs/{libID}/docs`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `projectID` | 项目ID |
| `libID` | 文档库ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "moduleID": {
      "type": "integer",
      "description": "所属目录",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "文档标题"
    },
    "content": {
      "type": "string",
      "description": "文档内容，支持HTML标签"
    }
  },
  "required": [
    "title",
    "content"
  ]
}
```

示例:

```json
{
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-createProjectDoc", {
  "projectID": 1,
  "libID": 1,
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
});
```
## 创建我的文档库目录

- SDK 调用：`request("doc/doc-createMyModule", params)`
- HTTP：`POST /doc/my/spaces/{spaceID}/libs/{libID}/modules`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |
| `libID` | 文档库ID |

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
      "description": "文档库目录"
    },
    "parentID": {
      "type": "integer",
      "description": "父目录",
      "format": "int32"
    }
  },
  "required": [
    "name"
  ]
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

const result = await request("doc/doc-createMyModule", {
  "spaceID": 1,
  "libID": 1,
  "name": "<string>",
  "parentID": 1
});
```
## 创建团队文档库目录

- SDK 调用：`request("doc/doc-createTeamModule", params)`
- HTTP：`POST /doc/team/spaces/{spaceID}/libs/{libID}/modules`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |
| `libID` | 文档库ID |

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
      "description": "文档库目录"
    },
    "parentID": {
      "type": "integer",
      "description": "父目录",
      "format": "int32"
    }
  },
  "required": [
    "name"
  ]
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

const result = await request("doc/doc-createTeamModule", {
  "spaceID": 1,
  "libID": 1,
  "name": "<string>",
  "parentID": 1
});
```
## 创建产品文档库目录

- SDK 调用：`request("doc/doc-createProductModule", params)`
- HTTP：`POST /doc/product/spaces/{productID}/libs/{libID}/modules`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `productID` | 产品ID |
| `libID` | 文档库ID |

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
      "description": "文档库目录"
    },
    "parentID": {
      "type": "integer",
      "description": "父目录",
      "format": "int32"
    }
  },
  "required": [
    "name"
  ]
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

const result = await request("doc/doc-createProductModule", {
  "productID": 1,
  "libID": 1,
  "name": "<string>",
  "parentID": 1
});
```
## 创建项目文档库目录

- SDK 调用：`request("doc/doc-createProjectModule", params)`
- HTTP：`POST /doc/project/spaces/{projectID}/libs/{libID}/modules`
- 动作类型：`create`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `projectID` | 项目ID |
| `libID` | 文档库ID |

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
      "description": "文档库目录"
    },
    "parentID": {
      "type": "integer",
      "description": "父目录",
      "format": "int32"
    }
  },
  "required": [
    "name"
  ]
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

const result = await request("doc/doc-createProjectModule", {
  "projectID": 1,
  "libID": 1,
  "name": "<string>",
  "parentID": 1
});
```
## 获取文档空间详情

- SDK 调用：`request("doc/doc-getSpace", params)`
- HTTP：`GET /doc/spaces/{spaceID}`
- 动作类型：`get`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`object`
- 结果字段：`space`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-getSpace", {
  "spaceID": 1
});
```
## 获取文档库详情

- SDK 调用：`request("doc/doc-getLib", params)`
- HTTP：`GET /doc/libs/{libID}`
- 动作类型：`get`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `libID` | 文档库ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`object`
- 结果字段：`lib`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-getLib", {
  "libID": 1
});
```
## 获取文档详情

- SDK 调用：`request("doc/get", params)`
- HTTP：`GET /doc/docs/{docID}`
- 动作类型：`get`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `docID` | 文档ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`object`
- 结果字段：`doc`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/get", {
  "docID": 1
});
```
## 修改文档空间

- SDK 调用：`request("doc/doc-updateSpace", params)`
- HTTP：`PUT /doc/spaces/{spaceID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |

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
      "description": "文档空间名称"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-updateSpace", {
  "spaceID": 1,
  "name": "<string>"
});
```
## 修改文档库

- SDK 调用：`request("doc/doc-updateLib", params)`
- HTTP：`PUT /doc/libs/{libID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `libID` | 文档库ID |

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
      "description": "文档库名称"
    },
    "acl": {
      "type": "string",
      "description": "open 公开(适用于团队文档库) | default 默认权限(适用于产品、项目文档库) | private 私有(适用于所有类型文档库)"
    },
    "groups": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些权限分组可以访问"
    },
    "users": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "如果acl=private,可以设置哪些用户可以访问"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-updateLib", {
  "libID": 1,
  "name": "<string>",
  "acl": "<string>",
  "groups": [
    "<string>"
  ],
  "users": [
    "<string>"
  ]
});
```
## 修改文档

- SDK 调用：`request("doc/update", params)`
- HTTP：`PUT /doc/docs/{docID}`
- 动作类型：`update`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `docID` | 文档ID |

### 查询参数

无查询参数。

### 请求体

请求体必填：是

Schema:

```json
{
  "type": "object",
  "properties": {
    "moduleID": {
      "type": "integer",
      "description": "所属目录",
      "format": "int32"
    },
    "title": {
      "type": "string",
      "description": "文档标题"
    },
    "content": {
      "type": "string",
      "description": "文档内容，支持HTML标签"
    }
  },
  "required": [
    "title",
    "content"
  ]
}
```

示例:

```json
{
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/update", {
  "docID": 1,
  "moduleID": 1,
  "title": "<string>",
  "content": "<string>"
});
```
## 修改文档库目录

- SDK 调用：`request("doc/doc-updateModule", params)`
- HTTP：`PUT /doc/modules/{moduleID}`
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
      "description": "文档库目录名称"
    }
  },
  "required": [
    "name"
  ]
}
```

示例:

```json
{
  "name": "<string>"
}
```

### 返回值

- 返回形态：`object`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-updateModule", {
  "moduleID": 1,
  "name": "<string>"
});
```
## 删除文档空间

- SDK 调用：`request("doc/doc-deleteSpace", params)`
- HTTP：`DELETE /doc/spaces/{spaceID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `spaceID` | 空间ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-deleteSpace", {
  "spaceID": 1
});
```
## 删除文档库

- SDK 调用：`request("doc/doc-deleteLib", params)`
- HTTP：`DELETE /doc/libs/{libID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `libID` | 文档库ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/doc-deleteLib", {
  "libID": 1
});
```
## 删除文档

- SDK 调用：`request("doc/delete", params)`
- HTTP：`DELETE /doc/docs/{docID}`
- 动作类型：`delete`

### 路径参数

| 参数 | 说明 |
| --- | --- |
| `docID` | 文档ID |

### 查询参数

无查询参数。

### 请求体

无请求体。

### 返回值

- 返回形态：`text`

### SDK 示例

```ts
import { request } from 'zentao-api';

const result = await request("doc/delete", {
  "docID": 1
});
```
## 删除文档库目录

- SDK 调用：`request("doc/doc-deleteModule", params)`
- HTTP：`DELETE /doc/modules/{moduleID}`
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

const result = await request("doc/doc-deleteModule", {
  "moduleID": 1
});
```
