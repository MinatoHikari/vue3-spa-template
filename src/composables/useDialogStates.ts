import type { EventHookOn, MaybeRefOrGetter } from '@vueuse/core'
import type { ModalProps } from 'naive-ui'

export interface GenEventConfig {
    title: string
    state: string
}

export const modalCommonProps: ModalProps = {
    preset: 'card',
    closable: true,
}

export function useDialogStates<T>(oConfig: {
    title: MaybeRefOrGetter<string>
    state?: string
}) {
    const { title, state: oState } = oConfig
    const titleTemp = ref<string | null>(null)
    const dialogVisible = ref(false)
    const dialogLoading = ref(false)
    const dialogPropData = ref<T>()
    const dialogState = ref(oState)
    const dialogTitle = customRef<string>((track, trigger) => {
        return {
            get: () => {
                track()
                return titleTemp.value ?? resolveUnref(title)
            },
            set: (v) => {
                titleTemp.value = v
                trigger()
            },
        }
    })
    const afterEnterHook = createEventHook()
    const afterLeaveHook = createEventHook()

    const getParams = (params?: T) => {
        if (!params)
            return params
        else if (['string', 'number', 'boolean'].includes(typeof params))
            return params
        else
            return { ...params }
    }

    const genEvent = (): [
        (params?: T, title?: string, config?: { state?: string }) => void,
        EventHookOn<T | undefined>,
        (config?: { state?: string, params?: T, title?: string }) => void,
    ] => {
        const eventHook = createEventHook<T | undefined>()
        const event = (
            params?: T,
            newTitle?: MaybeRefOrGetter<string>,
            config: { state?: string } = {},
        ) => {
            const { state } = config
            dialogVisible.value = true
            dialogPropData.value = getParams(params)
            dialogState.value = state ?? oState
            if (newTitle) {
                dialogTitle.value = resolveUnref(newTitle)
            }
            else {
                titleTemp.value = null
                dialogTitle.value = resolveUnref(title)
            }
            eventHook.trigger(params)
        }
        const configEvent = (config?: { params?: T, title?: string, state?: string }) => {
            const { params, title, state } = config ?? {}
            event(params, title, { state })
        }
        const on = eventHook.on
        return [event, on, configEvent]
    }

    const [open, handleOpen, configOpen] = genEvent()

    const events = {
        'on-after-enter': afterEnterHook.trigger,
        'on-after-leave': afterLeaveHook.trigger,
    }
    // console.log('params', { dialogVisible,
    // dialogLoading,
    // dialogPropData,
    // dialogTitle,
    // dialogState,
    // genEvent,
    // open,
    // handleOpen,
    // configOpen,
    // events,
    // handleAfterEnter: {
    //     on: afterEnterHook.on,
    //     off: afterEnterHook.off,
    // },
    // handleAfterLeave: {
    //     on: afterLeaveHook.on,
    //     off: afterLeaveHook.off,
    // },
    // dialogProps: {
    //     ...modalCommonProps,
    //     ...events,
    // },})
    return {
        dialogVisible,
        dialogLoading,
        dialogPropData,
        dialogTitle,
        dialogState,
        genEvent,
        open,
        handleOpen,
        configOpen,
        events,
        handleAfterEnter: {
            on: afterEnterHook.on,
            off: afterEnterHook.off,
        },
        handleAfterLeave: {
            on: afterLeaveHook.on,
            off: afterLeaveHook.off,
        },
        dialogProps: {
            ...modalCommonProps,
            ...events,
        },
    }
}
