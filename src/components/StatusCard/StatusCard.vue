<template>
    <n-space ref="nameTop" h-full justify="space-between" align="center" v-bind="$attrs">
        <n-space align="center">
            <n-icon flex size="55"><AvatarIcon /></n-icon>
            <div text-gray-500 font-bold>
                <div>
                    <RouterLink
                        active-class="link-active"
                        :to="isItemArray
                            ? (props.data as [Item, Item])[0].to
                            : (props.data as Item).to"
                    >
                        <n-ellipsis :style="{ maxWidth: ellipsisWidth }">
                            {{
                                isItemArray
                                    ? (props.data as [Item, Item])[0].name
                                    : (props.data as Item).name
                            }}
                        </n-ellipsis>
                    </RouterLink>
                </div>
                <div v-if="isItemArray" ref="nameBottom" mt-2>
                    <RouterLink active-class="link-active" :to="(props.data as [Item, Item])[1].to">
                        <n-ellipsis :style="{ maxWidth: ellipsisWidth }">
                            {{ (props.data as [Item, Item])[1].name }}
                        </n-ellipsis>
                    </RouterLink>
                </div>
            </div>
        </n-space>

        <div text-gray-700 text-2xl>
            <div>
                {{
                    isItemArray ? (props.data as [Item, Item])[0].value : (props.data as Item).value
                }}
            </div>
            <div v-if="isItemArray">
                {{ (props.data as [Item, Item])[1].value }}
            </div>
        </div>
    </n-space>
</template>

<script setup lang="ts">
import type { FunctionalComponent, PropType } from 'vue';
import type { StatusCardItem } from './types';

type Item = StatusCardItem;

const props = defineProps({
    icon: Object as PropType<FunctionalComponent>,
    data: [Object, Array] as PropType<Item | [Item, Item]>,
});

const isItemArray = computed(() => Array.isArray(props.data));

const AvatarIcon = props.icon;

const nameTop = templateRef<HTMLElement>('nameTop');

const { width: topWidth } = useElementSize(nameTop);

const ellipsisWidth = computed(() => {
    return `${topWidth.value - 105}px`;
});
</script>

<style scoped lang="postcss"></style>
