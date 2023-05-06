<template>
    <div v-if="authFrameLoaded" :display="isIframeRoute ? 'block' : 'none'" h-full w-full>
        <div v-for="i in iframeList" :key="i" h-full w-full>
            <n-spin h-full w-full :show="getLoading(i)">
                <div w-full h-full>
                    <iframe
                        v-show="i === calmelCaserouteKey"
                        :ref="(v) => setRef(v, i)"
                        :src="getSrc(i)"
                        frameborder="0"
                        w-full
                        h-full
                    />
                </div>
            </n-spin>
        </div>
    </div>
    <div v-if="showIframe">
        <iframe
            :ref="(v) => authFrame = v as HTMLIFrameElement"
            display-none
            :src="src"
            frameborder="0"
            h-0
            w-0
        />
    </div>
</template>

<script setup lang="ts">
import camelcase from 'camelcase';
import decamelize from 'decamelize';
import type { ComponentPublicInstance } from 'vue';
import { normalizePath, routeMap } from '../utils/router';
import { useCommonStore } from '~/stores/common';
import { useUserStore } from '~/stores/user';

const commonStore = useCommonStore();
const { currentRouteKey } = storeToRefs(commonStore);
const calmelCaserouteKey = computed(() =>
    camelcase(currentRouteKey.value.replaceAll('/', '-'), {
        pascalCase: true,
        preserveConsecutiveUppercase: true,
    }),
);
const router = useRouter();
const isIframeRoute = computed(() => router.currentRoute.value.path.includes('/service/cdc'));
const userStore = useUserStore();
const showIframe = ref(false);
const authFrameLoaded = ref(false);
const src = `${
    import.meta.env.VITE_CDC_AUTH_TARGET
}esc-sso/app/forward?ssoType=saml&appId=1908289244179217129&accountNo=CN000138`;
const iframeList = computed(() => commonStore.iframeList);
const iframeMap = ref(new Map<string, HTMLIFrameElement>());
const loadingMap = ref(new Map<string, boolean>());
const authFrame = ref<HTMLIFrameElement | null>(null);

const getSrc = (name: string) => {
    const item = routeMap.get(normalizePath(decamelize(name, { separator: '/' })));

    if (item && item.isFrame === '1') {
        return item.component;
    }
    return '';
};

const setRef = (iframeRef: Element | ComponentPublicInstance | null, iframeName: string) => {
    if (iframeRef) {
        iframeMap.value.set(iframeName, iframeRef as HTMLIFrameElement);
        if (!iframeMap.value.has(iframeName)) {
            loadingMap.value.set(iframeName, true);
        }
        (iframeRef as HTMLIFrameElement).onload = () => {
            loadingMap.value.set(iframeName, false);
        };
    }
};

const getLoading = (name: string) => {
    const loading = loadingMap.value.get(name);
    return loading ?? true;
};

watchArray(
    () => [...iframeList.value],
    (v, oldV, added, removed) => {
        removed.forEach((i) => {
            loadingMap.value.set(i, true);
        });
    },
);

if (userStore.userInfo?.isIframeUser) {
    showIframe.value = true;
}

watch(authFrame, (v) => {
    if (v)
        v.onload = () => {
            authFrameLoaded.value = true;
        };
});
</script>

<style scoped>
:deep(.n-spin-content) {
    height: 100%;
}
</style>
