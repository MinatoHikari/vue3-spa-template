<script setup lang="ts">
import { useCommonStore } from '~/stores/common'

const router = useRouter()
const commonStore = useCommonStore()
commonStore.showMenu = false

tryOnBeforeUnmount(() => {
    commonStore.showMenu = true
})
</script>

<template>
    <main mt-24 p="x4 y10" text="center teal-700 dark:gray-200">
        <n-result
            size="large"
            status="404"
            title="404"
            :description="$t('page.error.not_found_des')"
        >
            <template #footer>
                <div text-4xl>
                    {{ $t('page.error.not_found') }}
                </div>
                <n-button type="primary" m="3 t8" @click="router.back()">
                    {{ $t('button.back') }}
                </n-button>
            </template>
        </n-result>
    </main>
</template>

<route lang="yaml">
meta:
    layout: default
</route>
