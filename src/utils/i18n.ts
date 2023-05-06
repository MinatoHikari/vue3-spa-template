import { createI18n } from 'vue-i18n';
import type { Ref } from 'vue';

import zhCN from '../../locales/zh-CN';
import enUS from '../../locales/en-US';
import deDE from '../../locales/de-DE';
import frFR from '../../locales/fr-FR';
import { Locales } from '~/composables/i18n';
import { setDayjsLocale } from '~/composables/useDayjs';
import { commonRequests } from '~/requests/common/common.request';
import { resHandler } from '~/utils/http/handler';
import { useCommonStore } from '~/stores/common';

export const useStorageLocale = createGlobalState(() => {
    const defaultLocale = useStorage('locale', ref<Locales>(Locales.zhCN), localStorage, {
        deep: true,
        writeDefaults: true,
        listenToStorageChanges: true,
    }) as Ref<Locales>;

    return {
        defaultLocale,
    };
});

export const i18n = createI18n({
    legacy: false,
    messages: {
        [Locales.zhCN]: zhCN,
        [Locales.enUS]: enUS,
        [Locales.deDE]: deDE,
        [Locales.frFR]: frFR,
    },
    allowComposition: true,
});

export const { global: i18nGlobal } = i18n;

const i18nScope = effectScope();

export const initI18nScope = () => {
    i18nScope.run(() => {
        const { defaultLocale: locale } = useStorageLocale();
        const store = useCommonStore();

        i18nGlobal.locale.value = locale.value;

        setDayjsLocale(locale.value);

        watch(locale, async (val) => {
            store.locale = val;
            setDayjsLocale(val);

            if (store.authToken) {
                const res = await commonRequests.switchLang();
                await resHandler(res);
                await store.reFetchRoutes();
            }
        });
    });
};
