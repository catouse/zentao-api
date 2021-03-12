# [zentao-api](https://github.com/catouse/zentao-api)

禅道 API 调用模块。

## 使用方法

### 安装

```bash
npm install --save zentao-api
```

### 请求任何禅道 API

通过构建 `Zentao` API 调用实例，你可以使用链式方法 ``zentao.m(moduleName).f(methodName)...get()`` 来非常方便调用禅道任何 API。

```js
import { Zentao } form 'zentao-api';

// 创建一个禅道 API 调用对象
const zentao = new Zentao({
  	url: 'https://demo.zentao.net/',
  	account: 'demo',
    password: '123456'
});

// 调用 product-all 获取所有产品信息
const productAllResult = await zentao
  	.m('product')
  	.f('all')
    .get();

// 输出产品列表
console.log('All products', productAllResult.data.products);
    
// 调用 product-view 获取产品详细信息
const productViewResult = await zentao
		.m('product')
    .f('view')
    .withParams({productID: 1})
    .get();

// 输出产品信息
console.log('All products', productViewResult.data.prodcut);

// 调用 prodcut-add 添加新的产品到禅道
const productCreateResult = await zentao
    .m('product')
    .f('create')
    .post({
      name: 'New product',
      code: 'new_product_code'
    });

if (productCreateResult.status) {
  	console.log('"New product" added.');
}
```

你可以访问 <https://catouse.github.io/zentao-api/> 来查看所有可用 API 和详细示例。

### 禅道 12 常用方法调用

针对禅道 12 版本，通过内置的 `Zentao12` 调用类可以直接调用一些常见方法：

```js
import { Zentao12 } form 'zentao-api';

// 创建一个禅道12 API 调用对象
const zentao = new Zentao12({
  	url: 'https://demo.zentao.net/',
  	account: 'demo',
    password: '123456'
});

// 调用 product-all 获取所有产品信息
const productAllResult = await zentao.getProductList();
// 输出产品列表
console.log('All products', productAllResult.data.products);

// 调用 product-view 获取产品详细信息
const productViewResult = await zentao.getProduct({productID: 1})
// 输出产品信息
console.log('All products', productViewResult.data.prodcut);

// 调用 prodcut-add 添加新的产品到禅道
const productCreateResult = await zentao.addProduct({
    name: 'New product',
    code: 'new_product_code'
});
if (productCreateResult.status) {
  	console.log('"New product" added.');
}
```

 `Zentao12` 实例上所有可用的方法包括：

* addBug
* addDept
* addProduct
* addProject
* addTask
* addUser
* finishTask
* getBug
* getBugCreateParams
* getBugList
* getBugResolveParams
* getDeptList
* getProduct
* getProductCreateParams
* getProductList
* getProject
* getProjectCreateParams
* getProjectList
* getTask
* getTaskCreateParams
* getTaskFinishParams
* getTaskList
* getUserCreateParams
* getUserList
* resolveBug

`Zentao12` 继承自 `Zentao`，所以你仍然可以在 `Zentao12` 上调用 `zentao.m().f()...get()` 链式方法来请求禅道提供的任何 API。

你可以访问 <https://catouse.github.io/zentao-api/> 来查看所有可用 API 和详细示例。

## 开发

该项目框架基于 [`TSdx`](https://tsdx.io/)，完全使用 [TypeScript](https://www.typescriptlang.org/) 开发。

如果希望参与本项目开发，可以先了解以下内容。

### 启动开发模式

在开发目录执行 `npm install` 来安装依赖，然后执行如下命令启动开发模式：

```bash
npm start
```

该命令会立即编译项目，并且在 /dist 目录生成编译后的文件，编译完成后改命令并不会退出，而是持续监听 `src/` 目录下的文件变更，并适时自动重新编译。

### 构建

如果仅仅需要一次构建编译，只需要执行：

```bash
npm build
```

### 测试

该项目使用 `jest` 进行测试，执行如下命令即可：

```bash
npm test
```

### 生成 API 文档

该项目使用 [TypeDoc](https://typedoc.org/) 来根据源码中的注视自动生成 API 文档，只需要执行如下命令：

```bash
npm run doc
```

### 包大小分析

该项目使用 [`size-limit`](https://github.com/ai/size-limit) 来帮助分析包大小，只需要执行如下命令：

```bash
npm run size
```

如果需要通过可视化报告分析包大小，只需要执行：

```bash
npm run analyze
```

### 代码检查

执行：

```bash
npm run lint
```
