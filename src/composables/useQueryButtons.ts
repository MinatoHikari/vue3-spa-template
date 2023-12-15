import type { VNode } from 'vue'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { FormListItemRender } from 'navuelidate'
import QueryButtons from '~/components/QueryButtons.vue'

export function useQueryButtons(config: { showCollapsed?: MaybeRefOrGetter<boolean> } = {
    showCollapsed: true,
}) {
    const { showCollapsed } = config
    const showFeedback = ref(true)
    const searchHook = createEventHook()
    const resetHook = createEventHook()
    const collapseHook = createEventHook<boolean>()

    const render = () => {
        return h(QueryButtons, {
            onReset: () => resetHook.trigger({}),
            onSearch: () => searchHook.trigger({}),
            onCollapse: (v: boolean) => collapseHook.trigger(v),
            showCollapsed: resolveUnref(showCollapsed) ?? true,
        })
    }

    const defaultProps = {
        formItemGiProps: {
            suffix: true,
        },
    }

    const renderParams: [() => VNode, Omit<FormListItemRender, 'render'>] = [render, defaultProps]

    const hookRegisters = {
        onSearch: searchHook.on,
        onReset: resetHook.on,
        onCollapse: collapseHook.on,
    }

    collapseHook.on((v) => {
        showFeedback.value = v
    })

    return {
        hookRegisters,
        render,
        defaultProps,
        renderParams,
        showFeedback,
    }
}
