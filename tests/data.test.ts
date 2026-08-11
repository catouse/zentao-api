import { describe, expect, test } from 'bun:test';
import {
  filterData,
  pickFields,
  pickFieldsSingle,
  processData,
  searchData,
  sortData,
} from '../src/index';

const records = [
  { id: 1, title: 'Login bug', status: 'active', pri: 3, assignedTo: { id: 11, name: 'Alice' } },
  { id: 2, title: 'Signup crash', status: 'closed', pri: 1, assignedTo: { id: 12, name: 'Bob' } },
  { id: 3, title: 'Slow query', status: 'active', pri: 2, assignedTo: { id: 11, name: 'Alice' } },
];

describe('pickFields', () => {
  test('keeps only requested fields and supports nested paths', () => {
    expect(pickFieldsSingle(records[0], ['id', 'assignedTo.name'])).toEqual({
      id: 1,
      assignedTo: { name: 'Alice' },
    });
  });

  test('skips missing paths', () => {
    expect(pickFieldsSingle(records[0], ['id', 'missing', 'a.b.c'])).toEqual({ id: 1 });
  });

  test('maps over a list', () => {
    expect(pickFields(records, ['id'])).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});

describe('filterData', () => {
  test('AND group with nested key and numeric comparison', () => {
    const result = filterData(records, [
      {
        operator: 'AND',
        conditions: [
          { key: 'status', operator: '=', value: 'active' },
          { key: 'pri', operator: '>=', value: 2 },
        ],
      },
    ]);
    expect(result.map((r) => r.id)).toEqual([1, 3]);
  });

  test('OR group and fuzzy ~ operator', () => {
    const result = filterData(records, [
      {
        operator: 'OR',
        conditions: [
          { key: 'title', operator: '~', value: 'login' },
          { key: 'assignedTo.name', operator: '=', value: 'Bob' },
        ],
      },
    ]);
    expect(result.map((r) => r.id)).toEqual([1, 2]);
  });

  test('array value matches any (=) / none (!=)', () => {
    expect(filterData(records, [{ operator: 'AND', conditions: [{ key: 'id', operator: '=', value: ['1', '3'] }] }]).map((r) => r.id)).toEqual([1, 3]);
    expect(filterData(records, [{ operator: 'AND', conditions: [{ key: 'id', operator: '!=', value: ['1', '3'] }] }]).map((r) => r.id)).toEqual([2]);
  });

  test('multiple groups combine with AND', () => {
    const result = filterData(records, [
      { operator: 'OR', conditions: [{ key: 'status', operator: '=', value: 'active' }] },
      { operator: 'OR', conditions: [{ key: 'pri', operator: '<', value: 3 }] },
    ]);
    expect(result.map((r) => r.id)).toEqual([3]);
  });
});

describe('searchData', () => {
  test('case-insensitive across all fields by default', () => {
    expect(searchData(records, ['alice']).map((r) => r.id)).toEqual([1, 3]);
  });

  test('restricts to given fields', () => {
    expect(searchData(records, ['alice'], ['title']).map((r) => r.id)).toEqual([]);
  });

  test('combines comma-separated terms with AND and groups with OR', () => {
    expect(searchData(records, ['login,bug']).map((r) => r.id)).toEqual([1]);
    expect(searchData(records, ['login', 'crash']).map((r) => r.id)).toEqual([1, 2]);
  });

  test('keeps quoted commas inside a search term', () => {
    const data = [{ id: 1, title: 'Login, bug' }, { id: 2, title: 'Login bug' }];
    expect(searchData(data, ['"login, bug"']).map((r) => r.id)).toEqual([1]);
  });

  test('empty keywords return a copy of all', () => {
    const result = searchData(records, []);
    expect(result).toEqual(records);
    expect(result).not.toBe(records);
  });
});

describe('sortData', () => {
  test('numeric desc then immutable', () => {
    const result = sortData(records, ['pri:desc']);
    expect(result.map((r) => r.pri)).toEqual([3, 2, 1]);
    expect(records.map((r) => r.id)).toEqual([1, 2, 3]);
  });

  test('multi-key with string localeCompare', () => {
    const result = sortData(records, ['status:asc', 'id:desc']);
    expect(result.map((r) => r.id)).toEqual([3, 1, 2]);
  });

  test('accepts legacy underscore direction syntax', () => {
    expect(sortData(records, ['pri_desc']).map((r) => r.pri)).toEqual([3, 2, 1]);
  });

  test('accepts custom comparator function', () => {
    const result = sortData(records, [(a, b) => Number(a.id) - Number(b.id)]);
    expect(result.map((r) => r.id)).toEqual([1, 2, 3]);
  });
});

describe('processData', () => {
  test('converts list data before filtering and picking', () => {
    const result = processData(records, {
      convert: (items) => items.map(({ id, pri }) => ({ id, score: Number(pri) * 10 })),
      filter: ['score>=20'],
      sort: 'score:desc',
      pick: ['id'],
    });

    expect(result).toEqual([{ id: 1 }, { id: 3 }]);
  });

  test('list pipeline: filter -> search -> sort -> pick', () => {
    const result = processData(records, {
      filter: ['status=active'],
      search: ['alice'],
      sort: 'pri:desc',
      pick: ['id', 'pri'],
    });
    expect(result).toEqual([
      { id: 1, pri: 3 },
      { id: 3, pri: 2 },
    ]);
  });

  test('parses comparison operators and array values', () => {
    expect(processData(records, { filter: ['pri>=2'], pick: ['id'] })).toEqual([
      { id: 1 },
      { id: 3 },
    ]);
    expect(processData(records, { filter: ['id=[1,2]'], pick: ['id'] })).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  test('supports equality aliases, AND within a filter group, and OR across groups', () => {
    const result = processData(records, {
      filter: ['status:active,pri>=3', 'assignedTo.name=Bob'],
      sort: 'pri_desc',
      pick: ['id'],
    });
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('does not split quoted or array filter values at commas', () => {
    const data = [
      { id: 1, title: 'Login, bug', status: 'active' },
      { id: 2, title: 'Login bug', status: 'active' },
    ];
    expect(processData(data, { filter: ['title:"Login, bug"'] })).toEqual([data[0]]);
    expect(processData(records, { filter: ['id:[1,2]'], pick: ['id'] })).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('ignores operators inside quoted filter values when finding the condition operator', () => {
    const data = [{ id: 1, title: 'a>=b' }, { id: 2, title: 'other' }];
    expect(processData(data, { filter: ['title="a>=b"'] })).toEqual([data[0]]);
  });

  test('limit truncates after sort and before pick', () => {
    const result = processData(records, { sort: 'pri:desc', limit: '2', pick: ['id', 'pri'] });
    expect(result).toEqual([
      { id: 1, pri: 3 },
      { id: 3, pri: 2 },
    ]);
  });

  test('ignores invalid or empty limit values', () => {
    expect(processData(records, { limit: '0' })).toEqual([]);
    expect(processData(records, { limit: '' }).map((r) => r.id)).toEqual([1, 2, 3]);
    expect(processData(records, { limit: 'abc' }).map((r) => r.id)).toEqual([1, 2, 3]);
    expect(processData(records, { limit: '-1' }).map((r) => r.id)).toEqual([1, 2, 3]);
  });

  test('single object picks fields', () => {
    expect(processData(records[0], { pick: ['id', 'assignedTo.name'] })).toEqual({
      id: 1,
      assignedTo: { name: 'Alice' },
    });
  });

  test('converts a single object before picking fields', () => {
    expect(processData(records[0], {
      convert: (record) => ({ ...record, label: `#${record.id}: ${record.title}` }),
      pick: ['label'],
    })).toEqual({ label: '#1: Login bug' });
  });

  test('single object without pick returns a shallow copy', () => {
    const result = processData(records[0], {});
    expect(result).toEqual(records[0]);
    expect(result).not.toBe(records[0]);
  });
});
