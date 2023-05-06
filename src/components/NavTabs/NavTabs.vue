<template>
    <n-tabs
        v-if="navTabList.length > 0"
        :closable="navTabList.length !== 1 || $route.path !== homepage"
        :value="currentKey"
        size="small"
        type="card"
        pr="4"
        :tab-style="tabStyle"
        :tabs-padding="8"
        :class="panClass"
        v-bind="$attrs"
        style="width: 100%; height: 100%"
        @close="handleClose"
        @update:value="handleValueChange"
    >
        <n-tab
            v-for="(item, index) in navTabList"
            :key="item.path"
            :name="item.path ?? ''"
            @click.prevent.right="(e) => handleTabClick(index, e)"
        >
            {{ item.meta?.title }}
        </n-tab>
        <template #suffix>
            <slot name="suffix" />
        </template>
    </n-tabs>
    <n-dropdown
        :x="x"
        :y="y"
        placement="bottom-start"
        trigger="manual"
        :show="showDropdown"
        :options="options"
        @clickoutside="clickOutSide"
        @select="handleDropdownSelect"
    />
</template>

<script setup lang="ts">
import camelcase from 'camelcase';
import { useContextMenu } from './contextmenu';
import type { NavDataOrigin } from '~/utils/router';
import { deNormalizePath, routeMap } from '~/utils/router';
import { useCommonStore } from '~/stores/common';
import { panClass, tabStyle } from '~/layouts/default-modules/theme';

defineProps<{
    list: string[];
}>();
const emit = defineEmits({
    'update:list': (array: string[]) => {
        return array;
    },
});
const { homepage } = useHomePage();

const router = useRouter();
const commonStore = useCommonStore();
const navTabList = ref<NavDataOrigin[]>([]);
const storeKey = computed(() => commonStore.currentRouteKey);
const currentKey = ref(storeKey.value);

const handleValueChange = (val: string) => {
    currentKey.value = val;
    if (routeMap.has(val)) router.push(val);
};

const handleClose = (val: string) => {
    const index = navTabList.value.findIndex((i) => i.path === val);
    navTabList.value.splice(index, 1);
    if (index > 0) {
        router.push(navTabList.value[index - 1].path as string);
    } else if (index === 0 && navTabList.value.length > 0) {
        router.push(navTabList.value[0].path as string);
    } else {
        router.push(homepage.value);
    }
};

watch(storeKey, (val) => {
    currentKey.value = val;
    if (!routeMap.get(val)) return;
    if (
        !navTabList.value.find((i) => {
            return i.path === val;
        })
    ) {
        navTabList.value.push(routeMap.get(val) as NavDataOrigin);
    }
});

watch(
    () => [...navTabList.value],
    (val) => {
        emit(
            'update:list',
            val
                .filter((i) => i.path)
                .map((i) =>
                    camelcase(
                        deNormalizePath(i.path as string)
                            .split('/')
                            .join('-'),
                        {
                            pascalCase: true,
                            preserveConsecutiveUppercase: true,
                        },
                    ),
                ),
        );
    },
    {
        deep: true,
    },
);

commonStore.$onAction((context) => {
    if (context.name === 'reFetchRoutes') {
        context.after(() => {
            console.log('changeTabLocale');
            navTabList.value = navTabList.value.map((i) => {
                const path = i.path as string;
                if (routeMap.has(path)) {
                    return routeMap.get(path) as NavDataOrigin;
                }
                return i;
            });
        });
    }
});

const { x, y, handleDropdownSelect, handleTabClick, options, showDropdown, clickOutSide } =
    useContextMenu({
        navTabList,
        currentKey,
    });

if (routeMap.has(router.currentRoute.value.path)) {
    navTabList.value.push(routeMap.get(router.currentRoute.value.path) as NavDataOrigin);
}
</script>

<style scoped>
.menu-tab.n-tabs :deep(.n-tabs-nav.n-tabs-nav--card-type .n-tabs-pad),
.menu-tab.n-tabs :deep(.n-tabs-nav.n-tabs-nav--card-type .n-tabs-scroll-padding),
.menu-tab.n-tabs :deep(.n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab-pad),
.menu-tab.n-tabs :deep(.n-tabs-nav__suffix) {
    border-bottom: 0;
}
</style>
