import type { MaybeRefOrGetter } from '@vueuse/core';

export const withLoading = (fn: (e?: MouseEvent) => Promise<unknown>) => {
    const loading = ref(false);
    const onClick = async (e: MouseEvent) => {
        loading.value = true;
        await fn(e);
        loading.value = false;
    };

    return {
        loading,
        onClick,
    };
};

export const withParamsLoading = <T>(fn: (params: T, e?: MouseEvent) => Promise<unknown>) => {
    const loading = ref(false);
    const params = ref<T>();
    const onClick = async (e?: MouseEvent) => {
        if (!params.value) {
            console.warn('params undefined');
            return;
        }
        loading.value = true;
        await fn(params.value, e);
        loading.value = false;
    };

    return {
        loading,
        clickWithParams: (factory: MaybeRefOrGetter<T>, e?: MouseEvent) => {
            params.value = resolveUnref(factory);
            return onClick(e);
        },
    };
};
