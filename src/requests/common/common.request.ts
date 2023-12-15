import type { UserInfo } from '~/stores/user'
import { baseUrl, getRequest, postRequest } from '~/utils/http/request'
import type { NavDataOrigin } from '~/utils/router'
import type { Locales } from '~/composables/i18n'

export const getExampleKey = '/api/user/ticket'

export const commonRequests = {
    getRoutes: () => {
        return getRequest<undefined, NavDataOrigin[]>(`${baseUrl}/menu`)
    },
    logout: () => postRequest(`${baseUrl}/logout`),
    switchLang: () => postRequest(`${baseUrl}/switchLang`),
    getUserInfo: () =>
        getRequest<
            undefined,
            { user: UserInfo, userLang: Locales }
        >(`${baseUrl}/auth/user`),
}
