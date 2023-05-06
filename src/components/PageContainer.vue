<template>
    <div h-full>
        <keep-alive :include="['default', ...cachedPageNames]">
            <Component :is="currentComponent" :key="currentChild" @back="back" />
        </keep-alive>
    </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui';
import type { Component } from 'vue';
import type { LocationQueryValue } from 'vue-router';
import Undo from '~icons/carbon/undo';

const props = withDefaults(
    defineProps<{
        children: { name: string; component: Component }[];
        defaultComponent: Component;
        currentChild: string;
        defaultCachedPageNames?: string[];
        clearCacheWhenReturnToDefault?: boolean;
    }>(),
    {
        clearCacheWhenReturnToDefault: true,
    },
);

const emits = defineEmits({
    'update:currentChild': (name: string) => {
        if (!name) return false;
        return true;
    },
});

const route = useRoute();
const { addPageButton, removeItem } = useTabSuffix();
const { t } = useTypedI18n();

const { is } = route.query;

const history = ref<string[]>([]);
const pageButtonName = Symbol('detail-back');
const isBack = ref(false);
const back = () => {
    isBack.value = true;
    emits(
        'update:currentChild',
        history.value.length > 0 ? (history.value.at(-1) as string) : 'default',
    );
    Promise.resolve().then(() => {
        history.value.pop();
    });
};
const initPageButton = () => {
    addPageButton({
        name: pageButtonName,
        onClick: () => {
            back();
        },
        renderIcon: () => h(NIcon, {}, { default: () => h(Undo) }),
        toolTipContent: () => t('button.back'),
    });
};
const cachedPageNames = ref<string[]>(props.defaultCachedPageNames ?? []);
const currentChildRef = ref((is as LocationQueryValue) ?? props.currentChild ?? 'default');
const currentComponent = computed(
    () =>
        props.children.find((i) => i.name === currentChildRef.value)?.component ??
        props.defaultComponent,
);

watch(
    () => props.currentChild,
    (value, oldValue) => {
        console.log(value);
        if (value) {
            currentChildRef.value = value;
            if (oldValue && !isBack.value) history.value.push(oldValue);
        }
        if (value === 'default') {
            if (props.clearCacheWhenReturnToDefault) cachedPageNames.value = [];
            removeItem(pageButtonName);
            history.value = [];
        } else {
            cachedPageNames.value = props.defaultCachedPageNames ?? [];
            initPageButton();
        }
        isBack.value = false;
    },
);

onActivated(() => {
    if (currentChildRef.value !== 'default') initPageButton();
});

if (currentChildRef.value !== 'default') initPageButton();
import.meta.hot?.on('vite:afterUpdate', () => {
    if (currentChildRef.value !== 'default') initPageButton();
});

onUnmounted(() => {
    emits('update:currentChild', 'default');
});
</script>
