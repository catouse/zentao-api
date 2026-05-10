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

## 真实环境测试

真实环境测试不会包含在默认 `bun test` 或 `bun run check` 中，需要显式运行：

```sh
bun run test:real
```

如果需要保留本轮测试创建出的临时数据以便手动检查：

```sh
bun run test:real -- --keep-test-data
```

也可以用环境变量开启同样的行为：

```sh
ZENTAO_KEEP_TEST_DATA=true bun run test:real
```

测试会优先读取 `.env.local`，如果不存在则读取 `env.local`。支持的变量：

```ini
ZENTAO_URL=https://zentao.example.com
ZENTAO_ACCOUNT=admin
ZENTAO_PASSWORD=password
# 或直接提供 Token
ZENTAO_TOKEN=your-token
# 可选
ZENTAO_REVIEWER=admin
ZENTAO_KEEP_TEST_DATA=false
ZENTAO_TIMEOUT=30000
ZENTAO_INSECURE=false
```

`ZENTAO_REVIEWER` 用于启用了需求评审规则的环境；未设置时会复用 `ZENTAO_ACCOUNT`。

运行时会先打印脱敏后的环境信息，然后创建一个名称带 `zentao-api-real-` 前缀的临时产品。后续每个 API 步骤都会打印步骤名、接口名和关键结果。测试会围绕这个产品执行一条可回收的真实写入流程：验证产品详情/列表/更新，创建并查询 3 个需求，创建/更新/查询产品计划并把需求关联到计划，创建/更新项目和执行，基于需求创建 3 个任务并验证任务列表、详情、优先级修改、启动、完成和删除，再创建 3 个 Bug 并验证列表、详情、描述修改和解决。默认清理阶段会按任务、Bug、执行、项目、需求、计划、产品的逆序尽量删除所有临时数据；传入 `--keep-test-data` 时会跳过最终清理并打印保留数据的关键 ID。

## 扩展模块

生成的模块定义来自 `scripts/update-registry.ts`。你可以在调用 `request()` 前扩展模块，或新增、替换动作。同名模块默认合并定义：同名动作会替换，未知动作会追加；需要整体替换模块时传入 `{ relace: true }`。

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
