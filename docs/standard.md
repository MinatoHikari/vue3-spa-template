---
title: 开发规范
---

### 全局

1. 缩进使用 4 个空格
2. 变量使用 `camelCase` 驼峰，类名和类型、接口使用 `CamelCase` 大驼峰，环境变量使用 `SNAKE_CASE` 大写下划线
3. 禁止双等号，必须使用三等号
4. `template` 中的 `i18n` 需使用全局变量 `$t`（带$的）
5. 无特殊情况，`composition-api` 的响应式变量声明全都使用 `ref`
6. 国际化文件使用 `snake_case` 小写下划线命名

### 页面

1. 页面组件需命名，`name` 为大驼峰形式的页面路径（比如 `system/user/manage` 页面需要将组件 `name` 设置为 `SystemUserManage`）
2. 页面国际化，请按对应路径写在 `page` 属性下 （`system/user/manage` 写成 `page:{system:{user:manage:{xxx:xxx}'}}`）
3. 表格的每列宽度，需要根据表头和内容的文字长度设置 `min-width`, 至少让表头不换行，再根据内容长度加长，如过长可以设置 `max-width` 和 `ellipsis`
4. 使用 `useContainer` 的页面内子组件，`name` 需要和设置的缓存名称一致（一般就使用 `useContainer` 中的name即可）

<route>
{
  meta: {
    name: '开发规范',
    layout: 'doc'
  }
}
</route>

