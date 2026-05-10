import { afterEach, describe, expect, test } from 'bun:test';
import {
  ERRORS,
  ZentaoClient,
  getGlobalOptions,
  setGlobalOptions,
} from '../src/index';

function createMockServer(handler: (req: Request) => Response | Promise<Response>) {
  return Bun.serve({
    port: 0,
    fetch: handler,
  });
}

afterEach(() => {
  setGlobalOptions({
    client: undefined,
    recPerPage: undefined,
    limit: undefined,
    timeout: undefined,
    insecure: undefined,
  });
});

describe('ZentaoClient', () => {
  test('normalizes site root baseUrl to API v2 base URL', () => {
    const client = new ZentaoClient({ baseUrl: 'https://zentao.example.com/' });

    expect(client.baseUrl).toBe('https://zentao.example.com/api.php/v2');
  });

  test('request defaults to GET and attaches token when present', async () => {
    let receivedMethod = '';
    let receivedToken: string | null = null;
    let receivedUrl = '';
    const server = createMockServer((req) => {
      receivedMethod = req.method;
      receivedToken = req.headers.get('Token');
      receivedUrl = req.url;
      return Response.json({ status: 'success', value: 1 });
    });

    try {
      const client = new ZentaoClient({ baseUrl: server.url.toString(), token: 'test-token' });
      const response = await client.request('/products', { query: { pageID: 2 } });

      expect(response).toEqual({ status: 'success', value: 1 });
      expect(receivedMethod).toBe('GET');
      expect(receivedToken ?? '').toBe('test-token');
      expect(new URL(receivedUrl).pathname).toBe('/api.php/v2/products');
      expect(new URL(receivedUrl).searchParams.get('pageID')).toBe('2');
    } finally {
      server.stop();
    }
  });

  test('does not throw for ZenTao status fail payloads', async () => {
    const server = createMockServer(() => Response.json({ status: 'fail', message: 'bad params' }));

    try {
      const client = new ZentaoClient({ baseUrl: server.url.toString() });
      await expect(client.get('/products')).resolves.toEqual({ status: 'fail', message: 'bad params' });
    } finally {
      server.stop();
    }
  });

  test('login stores token on the instance and returns it', async () => {
    const tokens: Array<string | null> = [];
    const server = createMockServer((req) => {
      if (new URL(req.url).pathname.endsWith('/users/login')) {
        return Response.json({ status: 'success', token: 'login-token' });
      }
      tokens.push(req.headers.get('Token'));
      return Response.json({ status: 'success' });
    });

    try {
      const client = new ZentaoClient(server.url.toString());

      await expect(client.login('admin', 'secret')).resolves.toBe('login-token');
      await client.get('/products');

      expect(tokens).toEqual(['login-token']);
    } finally {
      server.stop();
    }
  });

  test('init creates and stores global singleton client', () => {
    const client = ZentaoClient.init({ baseUrl: 'https://zentao.example.com', token: 'tok' });

    expect(client).toBeInstanceOf(ZentaoClient);
    expect(getGlobalOptions().client).toBe(client);
  });

  test('exposes transport error messages through ERRORS', () => {
    expect(ERRORS.E_NO_GLOBAL_CLIENT).toContain('client');
    expect(ERRORS.E_HTTP_ERROR).toContain('HTTP');
  });
});
