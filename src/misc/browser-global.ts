import * as api from '../index.js';

// Bun 的 IIFE bundle 不总是自动挂载 globalName；这里显式暴露浏览器全局对象。
const globalTarget = globalThis as typeof globalThis & {
  ZentaoAPI?: typeof api;
  window?: { ZentaoAPI?: typeof api };
};

globalTarget.ZentaoAPI = api;
if (globalTarget.window) {
  globalTarget.window.ZentaoAPI = api;
}

export * from '../index.js';
