import {Method} from 'axios';

/**
 * 支持的禅道请求方式，影响 API 请求 URL 构建方式
 */
export type ZentaoRequestType = 'PATH_INFO' | 'GET';

/**
 * 禅道请求参数键值对
 */
export type ZentaoRequestParamPair = any[]; // [name: string, value: string]

/**
 * 禅道请求参数
 */
export type ZentaoRequestParams =
    | Array<ZentaoRequestParamPair>
    | string[]
    | string
    | Record<string, any>;

/**
 * 禅道 API 请求方式
 */
export type ZentaoRequestMethod = Method;

/**
 * 禅道 API 返回结果
 */
export interface ZentaoApiResult {
    /**
     * 状态
     *
     * @remarks
     * 如果为 `0` 则表示操作请求失败，如果为 `1`，表示操作请求成功
     */
    status: 0 | 1;

    /**
     * 服务器返回的描述结果的文本
     */
    msg?: any;

    /**
     * 请求结果数据
     */
    result?: any;
}

/**
 * 禅道 API 初始化选项
 */
export interface ZentaoOptions {
    /**
     * 禅道服务器地址
     */
    readonly url: string;

    /**
     * 登录账号
     */
    readonly account: string;

    /**
     * 登录密码
     */
    readonly password: string;

    /**
     * 请求形式
     */
    readonly accessMode?: ZentaoRequestType;

    /**
     * 是否将 token 存储到本地，如果设置为 `false`，则每次创建新的 `Zentao` 实例都会在首次调用 API 之前重新获取 Token
     */
    readonly preserveToken?: boolean;

    /**
     * 当前 `Zentao` 实例名称
     */
    readonly sessionName?: string;

    /**
     * 如果设置为 `true`，则会在控制台输出详细日志
     */
    readonly debug?: boolean;
}
