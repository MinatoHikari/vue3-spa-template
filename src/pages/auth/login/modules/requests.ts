import { useVDR } from 'v-demi-request';
import { useUserStore } from '../../../../stores/user';
import { baseUrl, getRequest } from '~/utils/http/request';
import { useResponseHandler } from '~/utils/http/handler';
import { useCommonStore } from '~/stores/common';

export interface LoginParams {
    username: string;
    password: string;
    verCodeKey: string;
    code: string;
}

export interface VerifyCodeResponse {
    img: string;
    verCodeKey: string;
}

export const useLoginRequests = () => {
    const { postRequest } = useApis();
    const { handler } = useResponseHandler();
    const commonStore = useCommonStore();
    const userStore = useUserStore();
    const router = useRouter();
    const errHook = createEventHook();
    const { t } = useTypedI18n();
    const { homepage } = useHomePage();

    return {
        login: async (data: LoginParams) => {
            // const result = await postRequest<LoginParams, string>(
            //     `${baseUrl}/auth/login`,
            //     { ...data },
            //     {
            //         headers: {
            //             Authorization: null,
            //             'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            //         },
            //     },
            // );
            const result = {
                code: 20000,
                err: '',
                res: '',
                headers: {},

            }

            return await handler(result, {
                onSuccess: async ({ res }) => {
                    commonStore.setAuthToken(res);

                    // await userStore.getUserInfo();

                    // await commonStore.reFetchRoutes();

                    await router.push(homepage.value);
                },
                onError: () => {
                    errHook.trigger({});
                },
                successMessage: t('request.auth.login_success'),
            });
        },
        onLoginError: errHook.on,
        verifyCode: () => {
            const verifyCodeUrl = ref('');
            const verCodeKey = ref('');
            const { onSuccess, send: refreshVerifyCode } = useVDR(
                `${baseUrl}/verifyCode`,
                (url: string) => getRequest<undefined, VerifyCodeResponse>(url),
                {
                    immediate: false,
                    retry: true,
                },
            );
            onSuccess((param) => {
                handler(param, {
                    onSuccess: ({ res }) => {
                        verifyCodeUrl.value = `data:image/jpg;base64,${res.img}`;
                        verCodeKey.value = res.verCodeKey ?? '';
                    },
                });
            });
            return {
                verifyCodeUrl,
                verCodeKey,
                refreshVerifyCode,
            };
        },
    };
};
