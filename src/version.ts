declare const __ZENTAO_API_BUILD__: string;
declare const __ZENTAO_API_VERSION__: string;

const fallbackBuild = 'development';
const fallbackVersion = '0.0.0-dev';

export const BUILD = typeof __ZENTAO_API_BUILD__ === 'string' ? __ZENTAO_API_BUILD__ : fallbackBuild;
export const VERSION = typeof __ZENTAO_API_VERSION__ === 'string' ? __ZENTAO_API_VERSION__ : fallbackVersion;
