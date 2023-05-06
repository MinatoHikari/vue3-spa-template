<template>
    <main>
        <n-layout has-sider position="absolute" style="top: 0; bottom: 0">
            <n-layout-sider
                v-if="showMenu"
                bordered
                z-2
                content-style="padding: 4px;"
                collapse-mode="width"
                :collapsed-width="0"
                :collapsed="mainCollapsed"
                :width="72"
                inverted
                show-trigger="bar"
                trigger-style="z-index:5"
                @collapse="mainCollapsed = true"
                @expand="mainCollapsed = false"
            >
                <n-space h-14 justify="center" align="center">
                    <n-icon color="white" flex size="30px">
                        <Logo />
                    </n-icon>
                </n-space>
                <n-menu
                    :ref="(vm) => setMenu(vm)"
                    :root-indent="16"
                    inverted
                    :value="mainSelected"
                    label-field="name"
                    :watch-props="['defaultValue']"
                    :options="menuOptionsMain"
                    :render-label="renderMainLabel"
                    @update:value="(key, item) => (mainSelected = key)"
                />
            </n-layout-sider>
            <n-layout-sider
                v-if="showMenu"
                :bordered="false"
                inverted
                content-style="padding: 4px;"
                collapse-mode="width"
                :collapsed-width="64"
                :collapsed="subCollapsed"
                :width="240"
                show-trigger
                :theme-overrides="layoutSiderThemeOverrides"
                @collapse="subCollapsed = true"
                @expand="subCollapsed = false"
            >
                <n-space h-14 :justify="subCollapsed ? 'center' : 'start'" align="center">
                    <n-text v-if="!subCollapsed" ml-4 h-full text-xl style="color: white">
                        sysname
                    </n-text>
                    <n-text v-else text-center w-full h-full text-xs style="color: white">
                        sysname
                    </n-text>
                </n-space>
                <n-menu
                    :ref="(vm) => setMenu(vm)"
                    :default-value="selectedMenu"
                    label-field="name"
                    inverted
                    :indent="24"
                    :watch-props="['defaultValue']"
                    :options="menuOptionsSub"
                    :render-label="renderSubLabel"
                    :render-icon="renderSubIcon"
                    @update:value="handleUpdateValue"
                />
            </n-layout-sider>
            <div relative flex flex-col overflow-hidden w-full>
                <n-layout-header v-if="showMenu" position="absolute" w-full h-12 p-1 bordered>
                    <n-grid x-gap="12" h-full>
                        <n-gi span="4">
                            <n-space align="center" h-full>
                                <RouterButton v-if="isDev" quaternary type="primary" to="/docs">
                                    {{ $t('page.document.document') }}
                                    <template #icon>
                                        <n-icon><i-carbon-document-preliminary /></n-icon>
                                    </template>
                                </RouterButton>
                                <UploadProgress v-if="uploadFileListLength > 0" />
                            </n-space>
                        </n-gi>
                        <n-gi span="12" />
                        <n-gi span="8" h-full>
                            <n-space align="center" justify="end" pr-2 h-full>
                                <n-dropdown
                                    placement="bottom-start"
                                    trigger="click"
                                    size="small"
                                    :options="options"
                                    @select="handleSelect"
                                >
                                    <n-button flex quaternary>
                                        <n-icon size="24">
                                            <i-carbon-language />
                                        </n-icon>
                                        <n-text ml-2>{{ nameMapRef.get(locale) }}</n-text>
                                    </n-button>
                                </n-dropdown>
                                <user-profile-menu />
                            </n-space>
                        </n-gi>
                    </n-grid>
                </n-layout-header>
                <n-layout-header v-if="showMenu" absolute mt-12 w-full h-12>
                    <n-space
                        h-full
                        w-full
                        absolute
                        z-1
                        top-0
                        border-b-1
                        border-solid
                        border-t-0
                        border-gray="500/10"
                        item-style="width:100%"
                        align="center"
                    >
                        <NavTabs v-if="showMenu" v-model:list="cachedRouteList">
                            <template #suffix>
                                <n-space h-full align="center">
                                    <component
                                        :is="item.render"
                                        v-for="item in suffixList"
                                        :key="item.name"
                                    />
                                </n-space>
                            </template>
                        </NavTabs>
                    </n-space>
                </n-layout-header>
                <n-layout
                    relative
                    :mt="showMenu ? '24' : '0'"
                    :mb="showFooter ? '12' : '0'"
                    content-style="display:flex;flex-direction:column;"
                    class="container-bg"
                >
                    <n-card
                        class="container-bg"
                        :bordered="false"
                        content-style="padding:.5rem"
                        h-full
                    >
                        <router-view v-slot="{ Component }">
                            <keep-alive :include="cachedRouteList">
                                <component :is="Component" />
                            </keep-alive>
                        </router-view>
                        <MicroContainer />
                        <IframeContainer />
                    </n-card>
                </n-layout>
                <n-layout-footer
                    v-if="showFooter"
                    position="absolute"
                    bordered
                    h-12
                    p-3
                    text-center
                >
                    {{ `@${$t('license.powered_by')}` }}
                </n-layout-footer>
            </div>
        </n-layout>
        <n-modal
            v-model:show="dialogVisible"
            style="max-width: 500px"
            :title="dialogTitle"
            v-bind="events"
            preset="card"
        >
            <RouteSearch />
        </n-modal>
    </main>
</template>

<script lang="ts">
import type { Ref } from 'vue';
import type { MenuGroupOption, MenuOption, NMenu } from 'naive-ui';
import { NEllipsis, NIcon, NTooltip } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user';
import { routerSearchName, useRouteSearchDialog } from './default-modules/routeSearchDialog';
import RouteSearch from './default-modules/routeSearch.vue';
import { getIcon } from './default-modules/icon';
import { useCommonStore } from '~/stores/common';
import { AuthFailedType, navigationGuard } from '~/utils/navigationGuard';
import type { NavDataOrigin } from '~/utils/router';
import { RouteType, formatRoutes, routeMap } from '~/utils/router';
import { functionRefWrapper } from '~/utils/helper';
import Logo from '~icons/assets-icons/logo';
import Search from '~icons/carbon/search';
import { layoutSiderThemeOverrides, tabStyle } from '~/layouts/default-modules/theme';

const fallbackHomePage = import.meta.env.VITE_HOMEPAGE_FALLBACK;

export default defineComponent({
    components: { Logo, RouteSearch },
    beforeRouteEnter(to, from, next) {
        navigationGuard<NavDataOrigin[]>(to, from, next, {
            onSourceFetch: async () => {
                // const { getUserInfo } = useUserStore();
                // await getUserInfo();
                // const res = await commonRequests.getRoutes();
                // const isSuccess = await resHandler(res, {});
                // if (!isSuccess) throw new Error('route fetch failed');
                // return res.res as NavDataOrigin[];
                return [];
            },
            sourceFormatter: async (source) => {
                routeMap.clear();
                return formatRoutes(source);
            },
            routerAuth: async (to) => {
                const commonStore = useCommonStore();
                commonStore.currentRouteKey = to.path;
                const validateRes = routeMap.has(commonStore.currentRouteKey);
                console.log(
                    'route auth result:',
                    validateRes,
                    '\npath:',
                    commonStore.currentRouteKey,
                );
                // return validateRes;
                return true;
            },
            onAuthFailed: (type) => {
                if (type === AuthFailedType.Route) {
                    next('/403');
                }
                if (type === AuthFailedType.Session) next('/auth/login');
            },
            onAuthSuccess: async () => {
                next();
            },
            excludeRoutes: [fallbackHomePage, '404', '403'],
        });
    },
    setup() {
        const isDev = import.meta.env.MODE === 'development';
        const globalLanguage = useGlobalLanguage();
        const commonStore = useCommonStore();
        const uerStore = useUserStore();
        const { cachedRouteList } = storeToRefs(commonStore);

        const uploadFileListLength = computed(() => uerStore.uploadList.length);

        const { suffixList, addPageButton } = useTabSuffix();

        const showFooter = ref(false);

        const { dialogVisible, dialogTitle, events, open } = useRouteSearchDialog();
        useEventListener(window, 'keyup', (e) => {
            if (e.key === '/' && e.ctrlKey) {
                open();
            }
        });

        const menuOptions = computed(() => commonStore.formattedRoutes);
        const menuOptionsMap = computed(() => {
            const map = new Map<string, MenuOption[]>();
            menuOptions.value.forEach((i) => {
                map.set(i.key as string, i.children as MenuOption[]);
            });
            return map;
        });
        const menuOptionsMain = computed(() =>
            (menuOptions as Ref<MenuOption[]>).value.map((i) => {
                const res = { ...i };
                delete res.children;
                return res;
            }),
        );
        const mainSelected = ref(
            routeMap.get(commonStore.currentRouteKey)?.rootKey ??
                menuOptionsMain.value[0]?.key ??
                '',
        );
        const selectedMenu = computed(() => commonStore.currentRouteKey ?? '');
        const mainCollapsed = ref(false);
        const subCollapsed = ref(false);
        const menu = ref<InstanceType<typeof NMenu> | null>(null);
        const setMenu = functionRefWrapper(menu);

        const handleUpdateValue = (key: string, item: MenuOption) => {
            const option = item as NavDataOrigin;
            console.log(option);
            commonStore.currentRouteKey = key;
        };

        const renderMainLabel = (item: MenuOption | MenuGroupOption) => {
            const option = item as NavDataOrigin;
            return h(
                NTooltip,
                { placement: 'right' },
                {
                    default: () => option.meta?.title ?? option.label,
                    trigger: () =>
                        h('div', { class: 'menu-icon-container' }, [
                            h(
                                'div',
                                { class: 'menu-div' },
                                h(NIcon, {
                                    color: 'white',
                                    component: getIcon(option.meta?.icon),
                                    size: 24,
                                }),
                            ),
                            // h('div', { class: 'menu-div' }, option.meta?.title ?? option.label),
                        ]),
                },
            );
        };

        const renderSubLabel = (item: MenuOption | MenuGroupOption) => {
            const option = item as NavDataOrigin;
            if (option.children) {
                return h('div', {}, h(NEllipsis, {}, { default: () => option.meta?.title }));
            }
            if (option.component === RouteType.InnerLink) {
                return h('a', { target: '_blank', href: option.path }, option.meta?.title);
            }
            return h(
                NEllipsis,
                {
                    tooltip: {
                        placement: 'right',
                    },
                },
                {
                    default: () =>
                        h(
                            RouterLink,
                            {
                                to: option.path ?? '',
                            },
                            () => option.meta?.title,
                        ),
                    tooltip: () => option.meta?.title,
                },
            );
        };

        const renderSubIcon = (item: MenuOption) => {
            const option = item as NavDataOrigin;
            if (option.meta?.icon)
                return h(NIcon, {
                    component: getIcon(option.meta.icon),
                    style: {
                        marginLeft: subCollapsed.value ? '8px' : '0',
                    },
                });
            return undefined;
        };

        watch(cachedRouteList, (val) => {
            console.log('cachedRouteList', val);
        });

        watch(selectedMenu, (val) => {
            menu.value?.showOption(val);
        });

        addPageButton({
            name: routerSearchName,
            renderIcon: () =>
                h(
                    NIcon,
                    {},
                    {
                        default: () => h(Search),
                    },
                ),
            onClick: () => {
                dialogVisible.value = true;
            },
            toolTipContent: () => dialogTitle.value,
            detached: true,
        });

        return {
            isDev,
            showFooter,
            menuOptionsMain,
            menuOptionsSub: computed(
                () => menuOptionsMap.value.get(mainSelected.value as string) ?? [],
            ),
            handleUpdateValue,
            ...globalLanguage,
            renderSubLabel,
            renderSubIcon,
            renderMainLabel,
            mainSelected,
            selectedMenu,
            menu,
            setMenu,
            mainCollapsed,
            subCollapsed,
            cachedRouteList,
            showMenu: computed(() => commonStore.showMenu),
            layoutSiderThemeOverrides,
            tabStyle,
            dialogVisible,
            dialogTitle,
            events,
            suffixList,
            uploadFileListLength,
        };
    },
});
</script>

<style scoped>
.container-bg {
    background-color: #f0f2f5;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-active {
    opacity: 0;
}

:deep(.menu-icon-container) {
    padding: 8px 1.5px;
    text-align: center;
    width: 100%;
}

:deep(.menu-div) {
    font-size: 13px;
    /* height: 20px; */
    margin-top: 8px;
}
</style>
