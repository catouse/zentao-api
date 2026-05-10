# zentao-api

`zentao-api` is a small JavaScript/TypeScript SDK for ZenTao API v2. It works in Node.js 18+, browser bundlers, and CDN/script-tag usage.

## Install

```sh
npm install zentao-api
```

## Client

```ts
import { ZentaoClient } from 'zentao-api';

const client = new ZentaoClient({
  baseUrl: 'https://zentao.example.com',
  token: 'your-token',
});

const products = await client.get('/products');
```

`baseUrl` is the ZenTao site root. The SDK appends `/api.php/v2` internally.

If you do not have a token yet:

```ts
const client = new ZentaoClient('https://zentao.example.com');
const token = await client.login('admin', 'password');
```

## Global Client And Module Request

```ts
import { ZentaoClient, request, setGlobalOptions } from 'zentao-api';

ZentaoClient.init({
  baseUrl: 'https://zentao.example.com',
  token: 'your-token',
});

setGlobalOptions({ recPerPage: '50' });

const result = await request('product-list', {});
```

Per-call options override global options:

```ts
const result = await request('bug-list', { product: 1 }, { limit: '10' });
```

## Extending Modules

Generated module definitions come from `scripts/update-registry.ts`. You can override modules or add/replace actions before calling `request()`.

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
  pathParams: { bugID: 'Bug ID' },
  resultType: 'text',
});
```

Node.js can load side-effect extension files from a directory:

```ts
import { loadModuleDefinitionsFromDirectory } from 'zentao-api/node';

await loadModuleDefinitionsFromDirectory('./zentao-modules');
```

Directory loading supports `.js`, `.mjs`, and `.cjs` files sorted by filename. TypeScript extension files should be compiled first.

## Browser

Bundlers can import the package normally:

```ts
import { ZentaoClient } from 'zentao-api';
```

For script tags, use the browser bundle and read `window.ZentaoAPI`:

```html
<script src="https://cdn.jsdelivr.net/npm/zentao-api@1.0.0/dist/browser/zentao-api.global.js"></script>
<script>
  const client = new window.ZentaoAPI.ZentaoClient('https://zentao.example.com');
</script>
```

Direct browser requests require the ZenTao server to allow CORS. Browser code also exposes tokens to the frontend, so use a backend proxy when that is not acceptable.

The `insecure` TLS option is Node-only and throws in browser runtimes.
