<template>
    <RouterLink
        custom
        :no-underline="true"
        :to="props.to"
        v-bind="props.routerLinkProps"
        #="{ href, route, navigate }"
    >
        <n-button
            v-bind="{ ...$attrs, ...extractButtonProps }"
            @click="(e) => handleClick({ href, route, navigate }, e)"
            @click.middle="(e) => handleMiddleClick({ href, route, navigate }, e)"
        >
            <slot />
            <template #icon>
                <slot name="icon" />
            </template>
        </n-button>
    </RouterLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type {
    NavigationFailure,
    RouteLocation,
    RouteLocationRaw,
    RouterLinkProps,
} from 'vue-router';
import { buttonProps } from 'naive-ui';

type RouterLinkSlots = {
    href: string;
    navigate: (e?: MouseEvent | undefined) => Promise<void | NavigationFailure>;
    route: RouteLocation & {
        href: string;
    };
};

const props = defineProps({
    to: {
        type: [String, Object] as PropType<RouteLocationRaw>,
        required: true,
    },
    routerLinkProps: Object as PropType<RouterLinkProps>,
    prebentMiddleClick: Boolean,
    preventDefault: Boolean,
    ...buttonProps,
});
const emits = defineEmits({
    click: (routerLinkSlot: RouterLinkSlots, e: MouseEvent) => {
        return true;
    },
    middleClick: (routerLinkSlot: RouterLinkSlots, e: MouseEvent) => {
        return true;
    },
});
const extractButtonProps = reactiveOmit(props, [
    'to',
    'routerLinkProps',
    'preventDefault',
    'prebentMiddleClick',
]);
const handleClick = (routerLinkSlot: RouterLinkSlots, e: MouseEvent) => {
    if (!props.preventDefault) routerLinkSlot.navigate(e);
    emits('click', routerLinkSlot, e);
};
const handleMiddleClick = (routerLinkSlot: RouterLinkSlots, e: MouseEvent) => {
    emits('middleClick', routerLinkSlot, e);
    if (!props.prebentMiddleClick) window.open(routerLinkSlot.href);
};
</script>
