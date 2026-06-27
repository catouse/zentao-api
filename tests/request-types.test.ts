import { describe, expect, test } from 'bun:test';
import { request, type DataRecord } from '../src/index';

interface ProductSummary {
  id: number;
  name: string;
}

async function typedRequestExamples(): Promise<void> {
  const products = await request('product/list', { recPerPage: 20, pageID: 1 });
  const rows: DataRecord[] | undefined = products.data;
  rows?.forEach((item) => String(item.id));

  await request('product/update', { id: 1, name: '产品 A', acl: 'open' });
  await request('bug/list', { productID: 1, status: 'active', page: 1 });

  const narrowed = await request<ProductSummary[]>('product/list', {});
  narrowed.data?.forEach((product) => product.name.toUpperCase());
}

describe('typed request examples', () => {
  test('compile without running network calls', () => {
    expect(typeof typedRequestExamples).toBe('function');
  });
});
