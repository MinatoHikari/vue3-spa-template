<script setup lang="ts" name="doc-container">
import { NMenu } from 'naive-ui'
import type { MenuGroupOption, MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import '~github-markdown/github-markdown.css'
import { functionRefWrapper } from '~/utils/helper'
import type { NavDataOrigin } from '~/utils/router'
import { deNormalizePath, normalizePath, routes } from '~/utils/router'

// console.log(styles);
const route = useRoute()

const collapsed = ref(false)
const menu = ref<InstanceType<typeof NMenu> | null>(null)
const setMenu = functionRefWrapper(menu)
const selectedMenu = computed(() => deNormalizePath(route.path))
function renderLabel(item: MenuOption | MenuGroupOption) {
    const option = item as NavDataOrigin
    if (option.children)
        return h('div', () => option.meta?.title)
    return h(
        RouterLink,
        {
            to: normalizePath(option.key as string).replaceAll('/index', '') ?? '/docs',
        },
        () => option.label,
    )
}
function handleUpdateValue(key: string, item: MenuOption) {
    const option = item as NavDataOrigin
    console.log(option)
}
console.log(routes)
const menuOptions = routes
    .reverse()
    .filter(i => i.path.includes('/docs'))
    .map((i) => {
        if (i.children && i.children[0]) {
            const item = i.children[0]
            return {
                label: item.meta?.name,
                key: item.name,
            } as MenuOption
        }
        return {}
    })
console.log(menuOptions)
</script>

<template>
    <div>
        <main class="doc">
            <n-layout position="absolute">
                <n-layout-header h-12 p-1 bordered>
                    <n-grid x-gap="12" h-full>
                        <n-gi span="4" />
                        <n-gi span="16" />
                        <n-gi span="4" h-full>
                            <n-space h-full justify="end" align="center">
                                <n-button @click="$router.back()">
                                    <n-icon><i-carbon-exit /></n-icon>
                                </n-button>
                                <n-button @click="$router.push('/')">
                                    <n-icon><i-carbon-home /></n-icon>
                                </n-button>
                            </n-space>
                        </n-gi>
                    </n-grid>
                </n-layout-header>
                <n-layout has-sider position="absolute" style="top: 48px; bottom: 48px">
                    <n-layout-sider
                        bordered
                        content-style="padding: 4px;"
                        collapse-mode="width"
                        :collapsed-width="64"
                        :collapsed="collapsed"
                        :width="240"
                        show-trigger
                        @collapse="collapsed = true"
                        @expand="collapsed = false"
                    >
                        <NMenu
                            :ref="(vm) => setMenu(vm)"
                            v-model:value="selectedMenu"
                            label-field="name"
                            :watch-props="['defaultValue']"
                            :options="menuOptions"
                            :render-label="renderLabel"
                            @update:value="handleUpdateValue"
                        />
                    </n-layout-sider>
                    <n-layout p="x-4 y-4">
                        <div mt-4 class="markdown-body">
                            <n-card>
                                <router-view v-slot="{ Component }">
                                    <keep-alive>
                                        <component :is="Component" />
                                    </keep-alive>
                                </router-view>
                            </n-card>
                        </div>
                    </n-layout>
                </n-layout>
            </n-layout>
        </main>
    </div>
</template>

<style scoped></style>
