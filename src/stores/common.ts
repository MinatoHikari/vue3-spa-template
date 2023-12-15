import type { NavDataOrigin } from '~/utils/router'
import { commonRequests } from '~/requests/common/common.request'
import { resHandler } from '~/utils/http/handler'
import { formatRoutes, routeMap } from '~/utils/router'
import { useAuthToken } from '~/utils/token'
import { useStorageLocale } from '~/utils/i18n'

export const useCommonStore = defineStore('common', () => {
    const { authToken } = useAuthToken()

    const { defaultLocale: locale } = useStorageLocale()

    const showMenu = ref(true)

    const formattedRoutes = ref<NavDataOrigin[]>([])
    const entriesRoutes = computed(() => {
        return toTreeArray(formattedRoutes.value)
    })

    const currentRouteKey = ref('')
    const cachedRouteList = ref<string[]>([])
    const iframeList = computed(() =>
        cachedRouteList.value.filter((i) => {
            return i.includes('ServiceCdc')
        }),
    )

    const setAuthToken = async (token: string) => {
        authToken.value = token
    }

    const clearAuth = async () => {
        authToken.value = ''
    }

    const reFetchRoutes = async () => {
        // const response = await commonRequests.getRoutes()
        // await resHandler(response, {
        //     onSuccess: ({ res }) => {
        //         routeMap.clear()
        //         formattedRoutes.value = formatRoutes(res)
        //     },
        // })
        await new Promise().resolve().then()
    }

    return {
        authToken,
        setAuthToken,
        formattedRoutes,
        entriesRoutes,
        locale,
        reFetchRoutes,
        currentRouteKey,
        cachedRouteList,
        clearAuth,
        showMenu,
        iframeList,
    }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCommonStore, import.meta.hot))
