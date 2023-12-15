import type { MaybeRefOrGetter } from '@vueuse/core'
import type { PopconfirmProps } from 'naive-ui'
import { NButton, NPopconfirm } from 'naive-ui'
import type { VNode } from 'vue'

export interface TableActionModel {
    popProps?: PopconfirmProps
    popSlots?: {
        default?: () => VNode | string
        icon?: () => VNode | string
        action?: () => VNode | string
    }
    label: string
    type?: 'default' | 'warning' | 'primary' | 'success' | 'error' | 'info'
    disabled?: boolean
    onClick?: () => void
}

function getActins(actions: MaybeRefOrGetter<TableActionModel[]>) {
    const { t } = useTypedI18n()
    return resolveUnref(actions).map((it, index, array) => {
        const button = h(
            NButton,
            {
                style: {
                    marginRight: index === array.length - 1 ? '' : '0.25rem',
                },
                type: it.type ?? 'primary',
                size: 'small',
                text: true,
                disabled: it.disabled ?? false,
                onClick: it.onClick,
            },
            {
                default: () => it.label,
            },
        )
        if (!it.popProps) {
            return button
        }
        else {
            return h(
                NPopconfirm,
                {
                    positiveText: t('confirm.ack'),
                    negativeText: t('confirm.cancel'),
                    ...it.popProps,
                },
                {
                    trigger: () => button,
                    ...it.popSlots,
                },
            )
        }
    })
}

export function useRenderActionFn<T>(fn: (rowData: T, rowIndex?: number) => MaybeRefOrGetter<TableActionModel[]>) {
    return (rowData: T, rowIndex?: number) => {
        return getActins(fn(rowData, rowIndex))
    }
}
