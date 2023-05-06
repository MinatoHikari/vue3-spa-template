<template>
    <main mt-24 p="x4 y10" text="center teal-700 dark:gray-200">
        <n-result
            size="large"
            status="403"
            title="403"
            :description="$t('page.error.auth_failed_des')"
        >
            <template #footer>
                <div text-4xl>{{ $t('page.error.auth_failed') }}</div>
                <n-button type="primary" m="3 t8" @click="router.back()">
                    {{ $t('button.back') }}
                </n-button>
            </template>
        </n-result>
    </main>
</template>

<script setup lang="ts">
import { useCommonStore } from '~/stores/common';

const router = useRouter();
const commonStore = useCommonStore();
commonStore.showMenu = false;

tryOnBeforeUnmount(() => {
    commonStore.showMenu = true;
});
</script>

<route lang="yaml">
meta:
    layout: default
</route>
