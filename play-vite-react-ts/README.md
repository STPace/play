# play-vite-react-ts

## 介绍

https://cn.vitejs.dev

vite 是在启动和 HMR 方面更快的前端开发服务器。

启动方面，对于应用的依赖模块使用 esbuild 预构建，对于应用的源码 vite 仅处理语法转换，以 ESM 的方式 `<script type="module" src="/src/main.tsx"></script>` 提供给浏览器，相当于浏览器接管了打包的工作。

HMR 方面，由于 vite 没有打包的过程，编辑代码后仅需要更新模块自身，因此无论应用大小，更新速度都很快。并对应用的依赖及源码添加 http 的强缓存 `Cache-Control: max-age=31536000,immutable` 和协商缓存 `304 Not Modified`，利用浏览器自身特性提升 HMR 的效率。

为了生产环境最佳的加载性能，使用 rollup 对代码打包，默认构建目标是 vite 特有的 modules 指支持 ESM 的浏览器。

使用 `https://github.com/vitejs/vite/tree/main/packages/plugin-legacy` 为 vite 提供不支持 ESM 浏览器的构建能力。

## 体验

```sh
yarn create @vitejs/app play-vite --template react-ts

yarn install

yarn dev
```
