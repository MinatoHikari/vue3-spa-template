import { useCommonStore } from '~/stores/common';
import { routeMap } from '~/utils/router';
import { useUserStore } from '~/stores/user';

export const useHomePage = () => {
    const commonStore = useCommonStore();
    const userStore = useUserStore()
    const defaultHomePage = import.meta.env.VITE_HOMEPAGE;
    const fallbackHomePage = import.meta.env.VITE_HOMEPAGE_FALLBACK;
    console.log(routeMap.has(defaultHomePage));

    const homepage = computed(() =>
        routeMap.has(defaultHomePage) ? defaultHomePage : fallbackHomePage,
    );

    return {
        homepage,
    };
};
