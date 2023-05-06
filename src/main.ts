import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createDefaultSettings } from 'navuelidate';
import { setGlobalOptions } from 'v-demi-request';
import App from './App.vue';
import { router } from './utils/router';
import { initQiankun } from '~/utils/qiankun';
import { initToken } from '~/utils/token';
import { i18n, initI18nScope } from '~/utils/i18n';

import '@unocss/reset/normalize.css';
import './styles/main.css';
import 'uno.css';
import './utils/dayjs';
import { initAxios } from '~/utils/http/axios';
import { useCommonStore } from '~/stores/common';

export const mode = import.meta.env.MODE;
const head = createHead();

(window as any).global = window;

initQiankun();
initAxios();
createDefaultSettings({
    formItemGiProps: {
        labelAlign: 'left',
    },
});
setGlobalOptions({
    retry: false,
});
const pinia = createPinia();
const app = createApp(App);
router.beforeEach((to, from, next) => {
    const commonStore = useCommonStore();
    const url = new URL(window.location.href);
    if (url.searchParams.has('showMenu')) {
        commonStore.showMenu = url.searchParams.get('showMenu') === '1';
    }
    next();
});
app.use(router).use(pinia).use(head).use(i18n).mount('#app');
initToken();
initI18nScope();
