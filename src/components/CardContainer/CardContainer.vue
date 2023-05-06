<template>
    <NCard
        class="card-container"
        :class="{
            'preset-fill-remain': hasPreset('fill-remain'),
            'preset-transparent': hasPreset('transparent'),
        }"
        v-bind="{ ...$attrs, ...props }"
        :content-style="contentStyle"
    >
        <slot />
        <template #header>
            <slot name="header" />
        </template>
        <template #header-extra>
            <slot name="header-extra" />
        </template>
        <template #cover>
            <slot name="cover" />
        </template>
        <template #footer>
            <slot name="footer" />
        </template>
        <template #action>
            <slot name="action" />
        </template>
    </NCard>
</template>

<script setup lang="ts" name="CardContainer">
import { cardProps } from 'naive-ui';
import type { PropType } from 'vue';

const props = defineProps({
    ...cardProps,
    size: {
        type: cardProps.size.type,
        default: 'small',
    },
    segmented: {
        type: cardProps.segmented.type,
        default: () => ({ content: true }),
    },
    preset: {
        type: [Array, String] as PropType<
            | ('query-form' | 'fill-remain' | 'transparent')[]
            | ('query-form' | 'fill-remain' | 'transparent')
        >,
    },
});

const hasPreset = (str: 'query-form' | 'fill-remain' | 'transparent') => {
    if (typeof props.preset === 'string' && str === props.preset) return true;
    else if (props.preset && props.preset.includes(str)) return true;
    else return false;
};

const contentStyle = computed(() => {
    const paddingNormal = hasPreset('transparent') ? '0' : '18px';
    const defaultContentStyle: Partial<CSSStyleDeclaration> = {
        paddingTop: paddingNormal,
        paddingBottom: hasPreset('query-form') ? '0' : paddingNormal,
        paddingLeft: paddingNormal,
        paddingRight: paddingNormal,
    };
    // if (hasPreset('fill-remain')) {
    //     defaultContentStyle.display = 'flex';
    //     defaultContentStyle.flexDirection = 'column';
    // }
    if (props.contentStyle) {
        if (typeof props.contentStyle === 'string') return props.contentStyle;
        else
            return {
                ...defaultContentStyle,
                ...props.contentStyle,
            };
    }
    return defaultContentStyle;
});
</script>

<style lang="postcss" scoped>
.card-container:not(:nth-child(1)) {
    @apply mt-2;
}

.preset-fill-remain {
    @apply flex-1;
}

.preset-transparent {
    @apply bg-transparent;
}
</style>
