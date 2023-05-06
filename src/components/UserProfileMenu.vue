<template>
    <n-space align="center" h-full>
        <n-dropdown :options="options" trigger="click" @select="handleSelect">
            <n-avatar color="grey" cursor-pointer flex relative size="small">
                <NIcon flex>
                    <i-carbon-user-avatar-filled />
                </NIcon>
            </n-avatar>
        </n-dropdown>
        <n-ellipsis style="max-width: 100px">
            {{ username }}
        </n-ellipsis>
    </n-space>
</template>

<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui';
import { NIcon } from 'naive-ui';
import Logout from '~icons/carbon/logout';
import { useUserStore } from '~/stores/user';
import { useThemeditorVisible } from '~/composables/useThemeEditor';
import SettingsView from '~icons/carbon/settings-view';

enum MenuKeys {
    logout = 'logout',
    showThemeEditor = 'showThemeEditor',
    Settings = 'Settings',
    ChangePsw = 'ChangePsw',
}

const showChangePsw = ref();

const { t } = useTypedI18n();
const userStore = useUserStore();
const { showThemeEditor, localFlagShowThemeEditor } = useThemeditorVisible();
const actionMap = new Map<string, () => void | Promise<void>>();

const username = computed(() => userStore.userInfo?.username);

const options: DropdownOption[] = [
    {
        label: () =>
            h('span', null, {
                default: () => t('auth.logout'),
            }),
        icon: () =>
            h(NIcon, null, {
                default: () => h(Logout),
            }),
        key: MenuKeys.logout,
    },
];

if (showThemeEditor) {
    options.unshift({
        label: () =>
            h('span', null, {
                default: () => t('button.show_theme_editor'),
            }),
        icon: () =>
            h(NIcon, null, {
                default: () => h(SettingsView),
            }),
        key: MenuKeys.showThemeEditor,
    });
}

actionMap.set(MenuKeys.logout, userStore.logout);
actionMap.set(MenuKeys.showThemeEditor, () => {
    localFlagShowThemeEditor.value = !localFlagShowThemeEditor.value;
});

const handleSelect = (key: string, option: DropdownOption) => {
    const action = actionMap.get(key);
    action && action();
};
</script>

<style scoped></style>
