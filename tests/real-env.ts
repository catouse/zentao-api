import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { randomUUID } from 'node:crypto';
import {
  ZentaoClient,
  request,
  setGlobalOptions,
  type RequestOptions,
  type ResponseData,
} from '../src/index';

const ENV_FILES = ['.env.local', 'env.local'] as const;

interface RealEnvConfig {
  baseUrl: string;
  token?: string;
  account?: string;
  password?: string;
  timeout?: number;
  insecure?: boolean;
}

let client: ZentaoClient | undefined;
let requestOptions: RequestOptions = {};
let productID: number | undefined;
let productName = '';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseEnvValue(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

async function loadLocalEnvFiles(): Promise<void> {
  for (const file of ENV_FILES) {
    if (!(await Bun.file(file).exists())) continue;

    const text = await Bun.file(file).text();
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) continue;

      const [, key, rawValue] = match;
      process.env[key] ??= parseEnvValue(rawValue);
    }
  }
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

async function loadRealEnvConfig(): Promise<RealEnvConfig> {
  await loadLocalEnvFiles();

  const baseUrl = readEnv('ZENTAO_URL') ?? readEnv('ZENTAO_BASE_URL');
  const token = readEnv('ZENTAO_TOKEN');
  const account = readEnv('ZENTAO_ACCOUNT');
  const password = readEnv('ZENTAO_PASSWORD');
  const timeout = Number(readEnv('ZENTAO_TIMEOUT') ?? 30000);
  const insecure = ['1', 'true', 'yes'].includes((readEnv('ZENTAO_INSECURE') ?? '').toLowerCase());

  if (!baseUrl) {
    throw new Error('Missing ZENTAO_URL or ZENTAO_BASE_URL in .env.local/env.local.');
  }
  if (!token && (!account || !password)) {
    throw new Error('Missing ZENTAO_TOKEN or ZENTAO_ACCOUNT/ZENTAO_PASSWORD in .env.local/env.local.');
  }

  return {
    baseUrl,
    token,
    account,
    password,
    timeout: Number.isFinite(timeout) ? timeout : 30000,
    insecure,
  };
}

function expectSuccess(response: ResponseData): void {
  expect(response.status).toBe('success');
}

function extractID(data: unknown): number {
  const id = isRecord(data) ? data.id : undefined;
  const numberValue = Number(id);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(`Expected response data to include a numeric id, got ${JSON.stringify(data)}`);
  }
  return numberValue;
}

function requireProductID(): number {
  if (!productID) throw new Error('Temporary product was not created.');
  return productID;
}

function productMatchesID(product: unknown, id: number): boolean {
  return isRecord(product) && String(product.id) === String(id);
}

describe('real ZenTao product API', () => {
  beforeAll(async () => {
    const config = await loadRealEnvConfig();
    client = new ZentaoClient({
      baseUrl: config.baseUrl,
      token: config.token,
      timeout: config.timeout,
      insecure: config.insecure,
    });

    if (!config.token) {
      await client.login(config.account!, config.password!);
    }

    requestOptions = {
      client,
      timeout: config.timeout,
      insecure: config.insecure,
    };
    setGlobalOptions({ client, timeout: config.timeout, insecure: config.insecure });

    productName = `zentao-api-real-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const response = await request('product/create', {
      name: productName,
      type: 'normal',
      acl: 'open',
    }, requestOptions);

    expectSuccess(response);
    productID = extractID(response.data);
  });

  afterAll(async () => {
    try {
      if (client && productID) {
        const response = await request('product/delete', { id: productID }, requestOptions);
        expectSuccess(response);
      }
    } finally {
      setGlobalOptions({
        client: undefined,
        recPerPage: undefined,
        limit: undefined,
        timeout: undefined,
        insecure: undefined,
      });
    }
  });

  test('gets the temporary product detail', async () => {
    const response = await request('product/get', { id: requireProductID() }, requestOptions);

    expectSuccess(response);
    expect(productMatchesID(response.data, requireProductID())).toBe(true);
  });

  test('lists products and includes the temporary product', async () => {
    const response = await request('product/list', {
      browseType: 'all',
      orderBy: 'id_desc',
      recPerPage: 1000,
      pageID: 1,
    }, requestOptions);

    expectSuccess(response);
    expect(Array.isArray(response.data)).toBe(true);
    expect((response.data as unknown[]).some((product) => productMatchesID(product, requireProductID()))).toBe(true);
  });

  test('updates the temporary product', async () => {
    const updatedName = `${productName}-updated`;
    const updateResponse = await request('product/update', {
      id: requireProductID(),
      name: updatedName,
      type: 'normal',
      acl: 'open',
    }, requestOptions);

    expectSuccess(updateResponse);

    const getResponse = await request('product/get', { id: requireProductID() }, requestOptions);
    expectSuccess(getResponse);
    expect(isRecord(getResponse.data) ? getResponse.data.name : undefined).toBe(updatedName);
  });
});
