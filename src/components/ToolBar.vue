<script setup lang="ts" name="ToolBar">
import type { GridItemProps } from 'naive-ui'
import { spaceProps } from 'naive-ui'
import type { PropType } from 'vue'

const props = defineProps({
    ...spaceProps,
    justify: {
        type: spaceProps.justify.type,
        default: 'space-between',
    },
    align: {
        type: spaceProps.align,
        default: 'center',
    },
    leftProps: {
        type: Object as PropType<GridItemProps>,
        default: () => ({ span: 12 }),
    },
    rightProps: {
        type: Object as PropType<GridItemProps>,
        default: () => ({ span: 12 }),
    },
    title: {
        type: String,
    },
})
</script>

<template>
    <n-grid w-full v-bind="{ ...$attrs, ...$props }">
        <n-gi v-bind="props.leftProps" class="toolbar-left">
            <n-space>
                <span v-if="title || $slots.title" class="tool-bar-title">
                    <slot name="title" />
                </span>
                <slot name="left" />
            </n-space>
        </n-gi>
        <n-gi v-bind="props.rightProps" class="toolbar-right">
            <n-space justify="end">
                <slot name="right" />
            </n-space>
        </n-gi>
    </n-grid>
</template>

<style lang="postcss" scoped>
.toolbar-right :deep(.n-button:not(:nth-last-child(1))) {
    @apply mr-2;
}

.toolbar-left :deep(.n-button:not(:nth-child(1))) {
    @apply ml-2;
}

.tool-bar-title {
    @apply text-lg mr-2;
}
</style>
