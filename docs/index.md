---
title: 项目文档
---

### 目录

-   `locales` - 语言文件目录
-   `viteEnv` - 环境变量文件目录
    -   参考 [vite 环境变量文档](https://cn.vitejs.dev/guide/env-and-mode.html)
    -   `.env.local.example` 首次使用删除 `.example`
    -   `BACKEND_URL` 本地联调时，设置此变量定义后端的 api 地址
    -   `BROWSER` 设置开发模式时用什么浏览器打开项目
-   `docs` - 文档文件目录
-   `src` - 项目资源主目录
-   `pages` - 页面文件目录
    -   文件系统路由，根据文件夹和 vue 文件、md 文件层级自动生成路由
    -   文档参考 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
    -   路由快捷导航:
        -   可在登录后键盘输入 `ctrl + /` 按路由路径导航 （支持大驼峰转换）
-   `components` - 组件目录，支持自动导入，在 vue 文件中引入无需 import
-   `composables` - 组合式 api 文件目录
-   `utils` - 工具类、第三方库管理
-   `stores` - pinia 状态目录
-   `assets` - 图片等静态资源目录
-   `requests` - 公共请求目录
-   `styles` - 全局样式目录

### 编辑器

- vscode 安装 `volar` 插件后在插件市场搜索 `@builtin typescript` 点击 `TypeScript and JavaScript Language Features` 右下角小齿轮，点击 `禁用（工作区）`

### 图标

项目使用 `unplugin-icons`, 所有放在 `src/assets/icons` 下的图标都可以通过 `~icons/assets-icons/{{图标名称}}` 来导入并使用（具体可以全局搜索 `~icons/assets-icons/` 查看使用样例）

在线图标库: [iconify-carbon](https://icon-sets.iconify.design/carbon/)

所有在线图标库中的图标都可以在 html 中使用 `<i-carbon-xxx />` (xxx为图标名) 自动导入，或使用 `import xxx from '~icons/carbon/xxx'` 引入

<route>
{
  meta: {
    name: '目录',
    layout: 'doc'
  }
}
</route>
