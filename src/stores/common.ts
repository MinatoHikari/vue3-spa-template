import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { NavDataOrigin } from '~/utils/router';

export const useCommonStore = defineStore('common', () => {
    const authToken = useStorage('authToken', ref('tokenD'), sessionStorage, {
        deep: true,
        writeDefaults: true,
        listenToStorageChanges: true,
    });

    const authorization = ref('');

    const formattedRoutes = ref<NavDataOrigin[]>([]);

    const isClient = ref(true);

    const setAuthToken = (token: string) => {
        console.log(token);
        authToken.value = token;
        authorization.value = `Bearer ${token}`;
    };

    return {
        authorization,
        setAuthToken,
        formattedRoutes,
        isClient,
    };
});
