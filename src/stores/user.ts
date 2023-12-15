import { useCommonStore } from '~/stores/common'
import { i18nGlobal } from '~/utils/i18n'
import { router as globalRouter, routeMap } from '~/utils/router'
import { commonRequests } from '~/requests/common/common.request'
import { resHandler } from '~/utils/http/handler'
import { globalMessage } from '~/utils/discreteApi'
import type { CreateAndUpdateDateProps } from '~/requests/common/types'

export type UserInfo = {
    username: string
    isIframeUser: boolean
} & CreateAndUpdateDateProps

export interface UploadProgressListItem { name: string, percentage: number, id: number }

function useUploadProgress() {
    const uploadItemIndex = ref(0)
    const showUploadProgress = ref(false)
    const uploadList = ref<UploadProgressListItem[]>([])

    return {
        uploadItemIndex,
        uploadList,
        showUploadProgress,
    }
}

export const useUserStore = defineStore('user', () => {
    const commonStore = useCommonStore()
    const instanceRouter = useRouter()
    const { availableLocales } = useAvailableLocaleList()

    const userInfo = ref<UserInfo | null>(null)

    const uploadProgress = useUploadProgress()

    const logoutCb = async () => {
        const router = instanceRouter ?? globalRouter
        console.log(instanceRouter ? 'instanceRouter' : 'globalRouter')
        routeMap.clear()
        commonStore.formattedRoutes = []
        await commonStore.clearAuth()
        await router.push('/auth/login')
        userInfo.value = null
        return globalMessage.success(i18nGlobal.t('auth.logout_success'))
    }

    const logout = async () => {
        if (!commonStore.authToken) {
            await logoutCb()
            return
        }
        const res = await commonRequests.logout()
        const isSuccess = await resHandler(res)
        if (isSuccess)
            await logoutCb()
    }

    const getUserInfo = async () => {
        const router = instanceRouter ?? globalRouter
    // if (!userInfo.value) {
    //     return commonRequests.getUserInfo().then(async (res) => {
    //         await resHandler(res, {
    //             onSuccess: ({ res }) => {
    //                 userInfo.value = res.user;
    //             },
    //         });
    //     });
    // }
    }

    return {
        logout,
        logoutCb,
        userInfo,
        getUserInfo,
        ...uploadProgress,
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
