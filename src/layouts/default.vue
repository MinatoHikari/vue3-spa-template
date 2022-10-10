<template>
    <main>
        <n-layout position="absolute">
            <n-layout-header style="height: 64px; padding: 24px" bordered>颐和园路</n-layout-header>
            <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
                <n-layout-sider bordered content-style="padding: 24px;">
                    <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
                </n-layout-sider>
                <n-layout content-style="padding: 24px;">
                    <RouterView />
                </n-layout>
            </n-layout>
            <n-layout-footer bordered position="absolute" style="height: 64px; padding: 24px">
                城府路
            </n-layout-footer>
        </n-layout>
    </main>
</template>

<script lang="ts">
import type { Ref } from 'vue';
import { defineComponent } from 'vue';
import type { MenuOption } from 'naive-ui';
import { fakeRoutes } from '~/main';
import { getRouteDataKey } from '~/requests/common/auth.request';
import { useCommonStore } from '~/stores/common';
import { postRequest } from '~/utils/http';
import { navigationGuard } from '~/utils/navigationGuard';
import { formatRoutes } from '~/utils/router';

export default defineComponent({
    beforeRouteEnter(to, from, next) {
        navigationGuard(to, from, next, {
            onSourceFetch: async () => {
                const data = await postRequest(getRouteDataKey, {}).catch((err) => {
                    console.log(err);
                    return false;
                });
                console.log(data);
                return fakeRoutes;
            },
            sourceFormatter: async (source) => {
                return formatRoutes(source);
            },
            routerAuth: async () => {
                return true;
            },
            onAuthFailed: () => {
                next('/auth/login');
            },
            onAuthSuccess: () => {
                next();
            },
        });
    },
    setup() {
        const commonStore = useCommonStore();

        const menuOptions = computed(() => commonStore.formattedRoutes);

        console.log(menuOptions.value);
        watch(menuOptions, (v) => {
            console.log(v);
        });

        const handleUpdateValue = (e: unknown) => {
            console.log(e);
        };

        return { menuOptions: menuOptions as Ref<MenuOption[]>, handleUpdateValue };
    },
});
</script>
