<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const { showUploadProgress } = storeToRefs(userStore)
const fileList = computed(() => userStore.uploadList)
function clearFinish() {
    userStore.uploadList = userStore.uploadList.filter(i => i.percentage < 100)
}
</script>

<template>
    <n-popover
        v-model:show="showUploadProgress"
        w-100
        max-h-100
        trigger="click"
        placement="right-start"
        scrollable
    >
        <template #trigger>
            <n-button quaternary type="primary" @click="showUploadProgress = !showUploadProgress">
                {{ $t('button.upload_progress') }}
                <template #icon>
                    <n-icon><i-carbon-cloud-upload /></n-icon>
                </template>
            </n-button>
        </template>
        <n-space justify="space-between">
            <span font-bold>上传列表</span>
            <n-button size="small" @click="clearFinish">
                清除已完成
            </n-button>
        </n-space>
        <n-list>
            <n-list-item v-for="item in fileList" :key="item.id">
                <template #prefix>
                    <div max-w-20>
                        <n-ellipsis>
                            {{ item.name }}
                        </n-ellipsis>
                    </div>
                </template>
                <n-progress
                    type="line"
                    :percentage="item.percentage"
                    indicator-placement="outside"
                    :processing="item.percentage < 100"
                    :status="item.percentage < 100 ? 'default' : 'success'"
                />
            </n-list-item>
        </n-list>
    </n-popover>
</template>
