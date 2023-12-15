import type { MaybeRefOrGetter } from '@vueuse/core'
import { NButton, NTooltip } from 'naive-ui'
import type { VNode, VNodeChild } from 'vue'

export interface SuffixList {
    name: string | symbol
    render: VNode
}

export interface AddPageButtonParams {
    name: string | symbol
    placement?: 'before' | 'after'
    renderIcon: () => VNodeChild
    onClick: (e: MouseEvent) => void
    toolTipContent: MaybeRefOrGetter<string>
    detached?: boolean
}

const suffixList = ref<SuffixList[]>([])

export function useTabSuffix() {
    const removeItem = (name: string | symbol) => {
        suffixList.value = suffixList.value.filter(i => i.name !== name)
    }
    const route = useRoute()
    const currentRoute = route.path

    const addPageButton = ({
        name,
        placement,
        renderIcon,
        onClick,
        toolTipContent,
        detached,
    }: AddPageButtonParams) => {
        if (suffixList.value.find(i => i.name === name))
            return

        const item: SuffixList = {
            name,
            render: h(
                NTooltip,
                {
                    placement: 'bottom',
                },
                {
                    default: () => resolveUnref(toolTipContent),
                    trigger: () =>
                        h(NButton, {
                            circle: true,
                            renderIcon,
                            onClick,
                        }),
                },
            ),
        }
        if (!placement || (placement && placement === 'after'))
            suffixList.value.push(item)
        if (placement && placement === 'before')
            suffixList.value.unshift(item)

        if (!detached) {
            watch(
                () => route.path,
                (val) => {
                    if (val !== currentRoute)
                        suffixList.value = suffixList.value.filter(i => i.name !== name)
                },
            )

            import.meta.hot?.on('vite:beforeUpdate', () => {
                if (typeof name !== 'string')
                    removeItem(name)
            })
        }
    }

    return {
        suffixList,
        removeItem,
        addPageButton,
    }
}
