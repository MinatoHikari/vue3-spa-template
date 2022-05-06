import { useStorage } from '@vueuse/core'
import axios from 'axios';
import { effectScope } from 'vue';

export const tokenScope = effectScope();

export const initToken = () => {
    tokenScope.run(() => {
        const authToken = useStorage('authToken', ref('tokenD'), sessionStorage, {
            deep: true,
            writeDefaults: true,
            listenToStorageChanges: true,
        });

        console.log('initToken', authToken.value);

        axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

        watch(
            () => authToken.value,
            (token) => {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            },
        );
    });
};
