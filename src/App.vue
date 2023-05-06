<template>
    <n-config-provider
        :locale="localeObj[localeStr].lang"
        :date-locale="localeObj[localeStr].date"
        :theme-overrides="theme"
    >
        <n-dialog-provider>
            <n-message-provider>
                <main font-sans text="gray-700 dark:gray-200">
                    <component
                        :is="
                            showThemeEditor && localFlagShowThemeEditor
                                ? NThemeEditor
                                : 'div-container'
                        "
                    >
                        <n-loading-bar-provider>
                            <n-message-provider>
                                <n-dialog-provider>
                                    <router-view />
                                </n-dialog-provider>
                            </n-message-provider>
                        </n-loading-bar-provider>
                    </component>
                </main>
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import {
    NThemeEditor,
    dateDeDE,
    dateEnUS,
    dateFrFR,
    dateZhCN,
    deDE,
    enUS,
    frFR,
    zhCN,
} from 'naive-ui';
import { Locales } from './composables/i18n';
import theme from './styles/naive-ui-theme-overrides.json';
import { useThemeditorVisible } from './composables/useThemeEditor';

const { locale } = useTypedI18n();
const localeStr = locale as Ref<Locales>;
const localeObj = shallowRef({
    [Locales.zhCN]: {
        lang: zhCN,
        date: dateZhCN,
    },
    [Locales.enUS]: {
        lang: enUS,
        date: dateEnUS,
    },
    [Locales.deDE]: {
        lang: deDE,
        date: dateDeDE,
    },
    [Locales.frFR]: {
        lang: frFR,
        date: dateFrFR,
    },
});

const { localFlagShowThemeEditor, showThemeEditor } = useThemeditorVisible();
</script>

<style scoped></style>
