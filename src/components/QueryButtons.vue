<template>
    <NSpace w-full justify="end" v-bind="$attrs">
        <NButton type="primary" v-bind="props.searchButtonProps" @click="$emit('search')">
            {{ $t('button.search') }}
        </NButton>
        <NButton type="default" v-bind="props.resetButtonProps" @click="$emit('reset')">
            {{ $t('button.reset') }}
        </NButton>
        <NButton v-if="props.showCollapsed" type="primary" quaternary @click="onCollapse">
            <span>
                {{ collapsed ? $t('button.expand') : $t('button.collapse') }}
            </span>
            <span class="icon" :class="{ rotate: !collapsed }">
                <i-carbon-chevron-down />
            </span>
        </NButton>
    </NSpace>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';

const props = withDefaults(
    defineProps<{
        searchButtonProps?: InstanceType<typeof NButton>['$props'];
        resetButtonProps?: InstanceType<typeof NButton>['$props'];
        defaultCollapsed?: boolean;
        showCollapsed?: boolean;
    }>(),
    {
        showCollapsed: true,
    },
);

const emits = defineEmits({
    search: () => true,
    reset: () => true,

    collapse: (collapse: boolean) => true,
});

const collapsed = ref(props.defaultCollapsed ?? false);

const onCollapse = () => {
    collapsed.value = !collapsed.value;
    emits('collapse', collapsed.value);
};
</script>

<style scoped>
.icon {
    transition: all 0.2s ease;
    transform: rotateZ(0);
}
.rotate {
    transform: rotateZ(180deg);
}
</style>
