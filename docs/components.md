---
title: 部分组件使用
---

- 子页面使用 `PageContainer`
  1. `currentChild` 注意使用 `v-model` 绑定，否则返回按钮不生效
  2. `PageContainer` 中 `CardContainer` 组件使用 `preset='fill-remain'` 结合 `useQueryPage` 的 `flexHeight` 时，需要注意 `PageContainer` 外部不能有其他容器， 如有其他容器，需要给容器设置 `h-full`

- 页面使用 `PageWrapper` 包裹
  1. 内部使用 `CardContainer` 卡片时，最后一个使用 `preset='fill-remain'`, 可以使最后一个卡片内容撑满页面剩余高度

<route>
{
  meta: {
    name: '部分组件使用',
    layout: 'doc'
  }
}
</route>