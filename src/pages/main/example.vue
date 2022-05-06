<template>
    <div>example-page</div>
</template>

<script lang="ts">
import { AxiosRequestConfig } from 'axios';
import { useVDR } from 'v-demi-request';
import { defineComponent } from 'vue';
import { getExampleKey } from '~/requests/common/auth.request';
import { request } from '~/utils/http';

export default defineComponent({
    setup() {
        const { data } = useVDR(
            [
                getExampleKey,
                {
                    method: 'get',
                } as Omit<AxiosRequestConfig, 'url'>,
            ],
            request,
            {
                retry: false,
            },
        );
        return { data };
    },
});
</script>

<style scoped></style>
