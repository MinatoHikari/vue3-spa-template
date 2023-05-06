import type { AxiosRequestConfig } from 'axios';
import type { ComputedRef } from 'vue';
import { i18nGlobal } from '~/utils/i18n';

function withLangConfig<K extends AxiosRequestConfig>(): ComputedRef<K>;
function withLangConfig<K extends AxiosRequestConfig>(config: K): ComputedRef<K>;
function withLangConfig<K extends AxiosRequestConfig>(config: K, useRef: true): ComputedRef<K>;
function withLangConfig<K extends AxiosRequestConfig>(config: K, useRef: false): K;
function withLangConfig<K extends AxiosRequestConfig>(config?: K, useRef = true) {
    const res = () => ({
        ...config,
        headers: {
            'Accept-Language': i18nGlobal.locale.value,
        },
    });
    if (useRef) return computed(res);
    return res();
}

export { withLangConfig };
