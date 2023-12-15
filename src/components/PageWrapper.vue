<script setup lang="ts">
import type { HTMLAttributes, PropType } from 'vue'

const props = defineProps({
    divProps: {
        type: Object as PropType<HTMLAttributes>,
    },
})
</script>

<template>
    <div h-full flex flex-col v-bind="{ ...$attrs, ...props.divProps }">
        <slot />
    </div>
</template>
