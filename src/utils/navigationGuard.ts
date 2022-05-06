import { useStorage } from '@vueuse/core';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useCommonStore } from '~/stores/common';
import type { NavDataOrigin } from '~/utils/router';

export interface RouteNavigationGuardConfig<T> {
    onSourceFetch: () => Promise<T>;
    sourceFormatter: (source: T) => Promise<NavDataOrigin[]>;
    routerAuth: (source: NavDataOrigin[]) => Promise<boolean>;
    onAuthFailed: () => void;
    onAuthSuccess: () => void;
    excludeRoutes?: string[];
}

const sessionAuth = async () => {
    const authToken = useStorage('authToken', '', sessionStorage);
    const commonStore = useCommonStore();
    if (authToken) {
        if (!commonStore.authorization) commonStore.setAuthToken(authToken.value);
        return true;
    }
    return false;
};

export const navigationGuard = async <T>(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    config: RouteNavigationGuardConfig<T>,
) => {
    const commonStore = useCommonStore();

    const routeData = await config.onSourceFetch();
    const formattedRouteData = await config.sourceFormatter(routeData);
    commonStore.formattedRoutes = formattedRouteData;
    let isSessionAuthSuccess = false;
    isSessionAuthSuccess = await sessionAuth();
    let isRouterAuthSuccess = false;
    if (isSessionAuthSuccess) {
        isRouterAuthSuccess = await config.routerAuth(formattedRouteData);
    } else config.onAuthFailed();

    if (isRouterAuthSuccess || (config.excludeRoutes && config.excludeRoutes.includes(to.path)))
        config.onAuthSuccess();
    else config.onAuthFailed();
};
