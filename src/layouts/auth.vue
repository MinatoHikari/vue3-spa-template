<script setup lang="ts">
const { options, handleSelect, locale } = useGlobalLanguage()

const isDev = import.meta.env.MODE === 'development'
</script>

<template>
    <div p="x-4 y-4">
        <n-grid :cols="1">
            <n-gi>
                <n-space justify="space-between" class="test home-set-con" style=" position:fixed; width:100%; top:0px;">
                    <div>
                        <RouterButton v-if="isDev" quaternary type="primary" to="/docs">
                            {{ $t('page.document.document') }}
                            <template #icon>
                                <n-icon><i-carbon-document-preliminary /></n-icon>
                            </template>
                        </RouterButton>
                    </div>
                    <div style=" position:fixed; right: 10px;">
                        <n-dropdown
                            placement="bottom-start"
                            trigger="click"
                            size="small"
                            :options="options"
                            @select="handleSelect"
                        >
                            <n-button quaternary>
                                <n-icon size="14">
                                    <i-carbon-language />
                                </n-icon>
                                <n-text ml-2>
                                    {{ locale }}
                                </n-text>
                            </n-button>
                        </n-dropdown>
                    </div>
                </n-space>
            </n-gi>
        </n-grid>
        <div>
            <div px-4 py-10 text-gray-700 dark:text-gray-200 h-full>
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style scoped>
.test {
    /* position: fixed;
    top: 40px; */
}
:deep(.home-set-con){
    position:fixed;
    width:100vw;
    top:400px;
    z-index: 2;
}
</style>
