/** 本地数据处理的基础记录类型，对应一条对象数据。 */
export type DataRecord = Record<string, unknown>;

/** 单条过滤条件，字段名支持 `.` 访问子字段。 */
export interface DataRecordFilter {
  /** 字段路径，例如 `status` 或 `assignedTo.id`。 */
  key: string;
  /** 比较运算符。 */
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | '~' | '!~';
  /** 比较值；数组用于 `=`/`!=`/`~`/`!~` 的“任一/全不”匹配。 */
  value: string | number | boolean | string[];
}

/** 一组过滤条件，组内按 `operator` 组合；多组之间按 AND 组合。 */
export interface DataRecordFilterGroup {
  /** 组内条件的组合方式。 */
  operator: 'AND' | 'OR';
  /** 组内条件列表。 */
  conditions: DataRecordFilter[];
}

/** 排序表达式；推荐 `字段:asc|desc`，兼容 `字段_asc|desc`。 */
export type SortExpr = `${string}:${'asc' | 'desc'}` | `${string}_${'asc' | 'desc'}`;

/** 自定义排序比较函数。 */
export type SortFn = (a: DataRecord, b: DataRecord) => number;

/** {@link processData} 处理列表时的选项；执行顺序为 转换 → 过滤 → 搜索 → 排序 → 限制数量 → 摘取。 */
export interface ProcessListOptions {
  /** 列表转换函数，在过滤前对记录数组整体执行。 */
  convert?: (records: DataRecord[]) => DataRecord[];
  /** 过滤表达式组，如 `["status=active,pri>=2", "assignedTo.id=5"]`；组内 AND、组间 OR，`=` 与 `:` 均表示相等。 */
  filter?: string[];
  /** 模糊搜索关键词组，如 `["登录,超时", "注册,失败"]`；组内 AND、组间 OR。 */
  search?: string[];
  /** 限定搜索字段，缺省时搜索全部字段。 */
  searchFields?: string[];
  /** 排序表达式，多个字段以英文逗号分隔；推荐 `pri:desc,id:asc`，兼容 `pri_desc,id_asc`。 */
  sort?: string;
  /** 限制返回列表数量，在排序后、摘取前截断；不改变服务端页大小。 */
  limit?: string;
  /** 摘取字段路径列表。 */
  pick?: string[];
}

/** {@link processData} 处理单条对象时的选项；执行顺序为 转换 → 摘取。 */
export interface ProcessSingleOptions {
  /** 转换函数，用于对对象进行转换。 */
  convert?: (record: DataRecord) => DataRecord;
  /** 摘取字段路径列表。 */
  pick?: string[];
}
