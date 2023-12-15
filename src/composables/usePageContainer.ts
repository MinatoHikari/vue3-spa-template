import type { MaybeRefOrGetter } from '@vueuse/core'
import type { Component, UnwrapRef } from 'vue'
import type { OpenNewWindowConfig } from './useNewWindow'
import { useNewWindow } from './useNewWindow'

export interface ContainerConfig<K> {
    children: { name: keyof K, component: Component }[]
    defaultComponent: Component
}

// 保证热更新 currentChild 正常
function useCurrentChild<K>() {
    const currentChild = ref<keyof K | 'default'>('default')

    return {
        currentChild,
    }
}

export function usePageContainer<T, K>(config: MaybeRefOrGetter<ContainerConfig<K>>, createDataHook?: () => T) {
    const eventsMap = new Map<string | number, () => void>()
    const pageToEventMap = new Map<keyof K | 'default', (string | number)[]>()
    const pageFromEventMap = new Map<keyof K | 'default', (string | number)[]>()
    const pageFromToEventMap = new Map<
        keyof K | 'default',
        { to: keyof K | 'default', eventName: string | number }[]
    >()

    const useContainer = createGlobalState(() => {
        const { currentChild } = useCurrentChild<K>()
        const containers = shallowRef(resolveUnref(config))
        const data = createDataHook ? createDataHook() : ({} as T)

        const to = async (childName: UnwrapRef<keyof K | 'default'>) => {
            currentChild.value = childName
        }

        const { openNewWindow: openWindowFn } = useNewWindow()

        const registerPageEvent = (name: string | number, func: () => void) => {
            eventsMap.set(name, func)
        }

        const dispatchPageEvent = (name: string) => {
            const fn = eventsMap.get(name)
            fn && fn()
        }

        const onTo = ({
            childName,
            eventName,
        }: {
            childName: keyof K | 'default'
            eventName: string | number
        }) => {
            if (!pageToEventMap.has(childName))
                pageToEventMap.set(childName, [])
            const events = pageToEventMap.get(childName) as (string | number)[]
            events.push(eventName)
        }

        const onFrom = ({
            childName,
            eventName,
        }: {
            childName: keyof K | 'default'
            eventName: string | number
        }) => {
            if (!pageFromEventMap.has(childName))
                pageFromEventMap.set(childName, [])
            const events = pageFromEventMap.get(childName) as (string | number)[]
            events.push(eventName)
        }

        const onFromTo = ({
            fromChildName,
            toChildName,
            eventName,
        }: {
            fromChildName: keyof K | 'default'
            toChildName: keyof K | 'default'
            eventName: string | number
        }) => {
            if (!pageFromEventMap.has(fromChildName))
                pageFromEventMap.set(fromChildName, [])
            const events = pageFromToEventMap.get(fromChildName)
            if (events) {
                events.push({
                    to: toChildName,
                    eventName,
                })
            }
        }

        watch(currentChild, (v, oldV) => {
            const toEventsArr = pageToEventMap.get(v as keyof K | 'default')
            const fromEventsArr = pageFromEventMap.get(oldV as keyof K | 'default')
            const fromToEventsArr = pageFromToEventMap.get(oldV as keyof K | 'default')
            if (toEventsArr) {
                toEventsArr.forEach((name) => {
                    const fn = eventsMap.get(name)
                    fn && fn()
                })
                toEventsArr.length = 0
            }
            if (fromEventsArr) {
                fromEventsArr.forEach((name) => {
                    const fn = eventsMap.get(name)
                    fn && fn()
                })
                fromEventsArr.length = 0
            }
            if (fromToEventsArr) {
                fromToEventsArr.forEach((item) => {
                    if (item.to === v) {
                        const fn = eventsMap.get(item.eventName)
                        fn && fn()
                    }
                })
                pageFromToEventMap.set(
                    oldV as keyof K | 'default',
                    fromToEventsArr.filter(i => i.to !== v),
                )
            }
        })

        return {
            data,
            currentChild: computed<keyof K | 'default'>({
                get: () => currentChild.value as keyof K | 'default',
                set: (v) => {
                    (currentChild.value as keyof K | 'default') = v
                },
            }),
            containerChildren: computed(() => containers.value.children),
            defaultComponent: computed(() => containers.value.defaultComponent),
            /** 打开新标签页，第一个参数 pathName 为要跳转到的子页面名称, 传递数据用 params, showMenu 可以让新标签页隐藏导航栏 */
            openNewWindow: (pathName: keyof K | 'default', config?: OpenNewWindowConfig) => {
                openWindowFn('', {
                    is: pathName as string,
                    ...config,
                })
            },
            /** 跳转到对应的 currentChild */
            to,
            /** 订阅事件，当 currentChild 变化时，检测变化后值是否和传入的 childName 一致，一致则触发 eventName 对应事件, 事件触发后会被移出订阅列表 */
            onTo,
            /** 订阅事件，当 currentChild 变化时，检测变化前值是否和传入的 childName 一致，一致则触发 eventName 对应事件, 事件触发后会被移出订阅列表 */
            onFrom,
            /** 订阅事件，当 currentChild 变化时，检测页面是否从 fromChildName 跳转到 toChildName，一致则触发 eventName 对应事件, 事件触发后会被移出订阅列表 */
            onFromTo,
            /** 注册事件，可使用 dispatchPageEvent 手动触发，也可以使用 onTo/onFrom 订阅触发 */
            registerPageEvent,
            /** 手动触发 registerPageEvent 注册的事件 */
            dispatchPageEvent,
        }
    })

    return useContainer
}

export function usePageContainerBack() {
    const vm = getCurrentInstance()

    const back = () => {
        vm?.emit('back')
    }

    return {
        back,
    }
}
