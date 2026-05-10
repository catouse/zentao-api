# zentao-api

`zentao-api` 是一个面向禅道 API v2 的轻量 JavaScript/TypeScript SDK，可用于 Node.js 18+、浏览器打包工具以及 CDN/script 标签场景。

## 安装

```sh
npm install zentao-api
```

## 客户端

```ts
import { ZentaoClient } from 'zentao-api';

const client = new ZentaoClient({
  baseUrl: 'https://zentao.example.com',
  token: 'your-token',
});

const products = await client.get('/products');
```

`baseUrl` 是禅道站点根地址。SDK 会在内部追加 `/api.php/v2`。

如果还没有 token：

```ts
const client = new ZentaoClient('https://zentao.example.com');
const token = await client.login('admin', 'password');
```

## 全局客户端与模块请求

```ts
import { ZentaoClient, request, setGlobalOptions } from 'zentao-api';

ZentaoClient.init({
  baseUrl: 'https://zentao.example.com',
  token: 'your-token',
});

setGlobalOptions({ recPerPage: '50' });

const result = await request('product/list', {});
```

单次调用的选项会覆盖全局选项：

```ts
const result = await request('bug/list', { product: 1 }, { limit: '10' });
```

## 扩展模块

生成的模块定义来自 `scripts/update-registry.ts`。你可以在调用 `request()` 前覆盖模块，或新增、替换动作。

```ts
import { defineModuleActions, defineModules } from 'zentao-api';

defineModules({
  name: 'custom',
  actions: [
    {
      name: 'list',
      type: 'list',
      method: 'GET',
      path: '/custom',
      resultType: 'list',
      resultGetter: 'items',
    },
  ],
});

defineModuleActions('bug', {
  name: 'archive',
  type: 'action',
  method: 'PUT',
  path: '/bugs/{bugID}/archive',
  pathParams: { bugID: 1 },
  resultType: 'text',
});
```

如果扩展定义拆分在多个文件中，请在应用启动入口中显式导入这些文件，确保它们在调用 `request()` 前完成注册。

## 浏览器

浏览器打包工具可以正常导入这个包：

```ts
import { ZentaoClient } from 'zentao-api';
```

如果使用 script 标签，请使用浏览器构建包，并从 `window.ZentaoAPI` 读取 API：

```html
<script src="https://cdn.jsdelivr.net/npm/zentao-api@1.0.0/dist/browser/zentao-api.global.js"></script>
<script>
  const client = new window.ZentaoAPI.ZentaoClient('https://zentao.example.com');
</script>
```

浏览器直接请求要求禅道服务器允许 CORS。浏览器代码也会把 token 暴露给前端；如果这不可接受，请使用后端代理。

`insecure` TLS 选项仅适用于 Node.js，在浏览器运行时会抛出错误。
