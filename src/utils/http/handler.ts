import type { MessageApi, MessageReactive } from 'naive-ui';
import { useMessage } from 'naive-ui';
import type { ComposerTranslation } from 'vue-i18n';
import type { AxiosError } from 'axios';
import type { EventHookOn } from '@vueuse/core';
import type { FilteredRequestResult, RequestResult } from '~/utils/http/request';
import { HttpHeaders } from '~/utils/http/request';
import { globalMessage } from '~/utils/discreteApi';
import { i18nGlobal } from '~/utils/i18n';
import { useUserStore } from '~/stores/user';
import type { Locales } from '~/composables/i18n';

export interface ResponseHandlerConfig<T, R = T, RT = void, RR = void> {
    onSuccess?: (params: HandledResponse<T>) => RT | PromiseLike<RT>;
    onError?: (params: HandledResponse<R>) => RR | PromiseLike<RR>;
    replaceDefaultErrHandler?: boolean;
    replaceDefaultSuccessHandler?: boolean;
    successMessage?: boolean | string;
    errMessage?: boolean | string;
    message?: MessageApi;
    warningCodeList?: number[];
    errorCodeList?: number[];
    t?: ComposerTranslation<{}, Locales.enUS>;
}

export interface HandledResponse<T> {
    res: T;
    code: number;
    msg?: string;
}

let message: MessageReactive | null = null;

const authErrorCallback = (code: number) => {
    const { logoutCb } = useUserStore();
    if (code === 40100) {
        if (!message)
            logoutCb().then((m) => {
                if (!message) message = m;
            });
    }
};

const getMessage = (customMsg: boolean | string, msg?: string) => {
    if (typeof customMsg === 'boolean') return msg;
    return customMsg;
};

/**
 * 处理请求返回的 blob 对象，如果是 json 则将对象转为 json, 不是则返回 null
 */
const handleBlob = async <T>(blob: Blob) => {
    if (blob.type === HttpHeaders.contentType.value.applicationJson) {
        const textDecoder = new TextDecoder('utf-8');
        const buffer = await blob.arrayBuffer();
        const res = JSON.parse(textDecoder.decode(new Uint8Array(buffer))) as RequestResult;
        return {
            res: (res.data as T) ?? null,
            err: res.data === 20000 ? null : res.message,
            code: res.code,
            msg: res.message,
            headers: {},
        } as FilteredRequestResult<T>;
    }
    return null;
};

/**
 *  请求回调处理函数，默认返回 Promise<boolean> 表示成功失败
 *  如果 onSuccess 或 onError 有返回值, 则用 Promise 包裹其返回值并返回
 * @param requestResult 传入请求结果
 * @param config 可配置成功失败的回调函数、是否自动读取请求 message 并弹出, 可设置默认的 message 文本
 */
export const resHandler = async <T, R = string[] | undefined, RT = void, RR = void>(
    requestResult: FilteredRequestResult<T>,
    config?: ResponseHandlerConfig<T, R, RT, RR>,
) => {
    const { err, res, msg, code } = requestResult;

    const resolvedConfig = {
        replaceDefaultErrHandler: false,
        replaceDefaultSuccessHandler: false,
        successMessage: false,
        errMessage: true,
        ...config,
    };
    const {
        onSuccess,
        onError,
        replaceDefaultErrHandler,
        replaceDefaultSuccessHandler,
        errMessage,
        successMessage,
        message,
        warningCodeList,
        errorCodeList,
        t,
    } = resolvedConfig;
    const existMessage = message ?? globalMessage;
    const errorCodeMergeList = [50000, ...(errorCodeList ?? [])];

    const existT = t ?? i18nGlobal.t;

    if (err) {
        if (!replaceDefaultErrHandler) {
            const message = getMessage(errMessage, msg) ?? existT('request.failed_placeholder');
            if (errMessage) {
                if (errorCodeMergeList.includes(code)) existMessage.error(message);
                else existMessage.warning(message);
            }
        }
        let onErrorRes: RR | false = false;
        if (onError) {
            onErrorRes = await onError({
                res: res as R,
                code,
                msg,
            });
        }
        if ([40100].includes(code)) {
            authErrorCallback(code);
        }
        return onErrorRes;
    }
    if (!replaceDefaultSuccessHandler) {
        successMessage &&
            existMessage.success(
                getMessage(successMessage, msg) ?? existT('request.success_placeholder'),
            );
    }
    let onSuccessRes: RT | true = true;
    if (onSuccess)
        onSuccessRes = await onSuccess({
            res: res as T,
            code,
            msg,
        });
    return onSuccessRes;
};

export const blobHandler = async <T, R = string[] | undefined, RT = void, RR = void>(
    requestResult: FilteredRequestResult<Blob>,
    config?: ResponseHandlerConfig<T, R, RT, RR>,
) => {
    const res = await handleBlob<T>(requestResult.res as Blob);
    if (res !== null) return resHandler(res, config);
    else return resHandler(requestResult as FilteredRequestResult<T>, config);
};

export const useResponseHandler = () => {
    const message = useMessage();
    const { t } = useTypedI18n();

    const vdrHandler = <T, R = string[] | undefined, RT = void, RR = void>(
        fn: EventHookOn<FilteredRequestResult<T>>,
        config?: Omit<ResponseHandlerConfig<T, R, RT, RR>, 'onSuccess' | 'onError'>,
    ) => {
        const successHook = createEventHook<HandledResponse<T>>();
        const errorHook = createEventHook<HandledResponse<string[] | undefined>>();
        const isSuccess = ref<boolean | void>(false);
        fn(async (params) => {
            isSuccess.value = await resHandler(params, {
                message,
                t,
                ...config,
                onSuccess: (p) => {
                    successHook.trigger(p);
                },
                onError: (p) => {
                    errorHook.trigger(p);
                },
            });
        });

        return {
            isSuccess,
            onSuccess: successHook.on,
            onError: errorHook.on,
        };
    };

    return {
        handler: async <T, R = string[] | undefined, RT = void, RR = void>(
            requestResult: FilteredRequestResult<T>,
            config?: ResponseHandlerConfig<T, R, RT, RR>,
        ) => resHandler(requestResult, { message, t, ...config }),
        /** 同 resHandler 但是传入的 requestResult 的 res 必须为blob */
        blobHandler: async <T, R = string[] | undefined, RT = void, RR = void>(
            requestResult: FilteredRequestResult<Blob>,
            config?: ResponseHandlerConfig<T, R, RT, RR>,
        ) => blobHandler(requestResult, { message, t, ...config }),
        vdrHandler,
    };
};

export const httpErrorHandler = (error: any) => {
    console.log(error);
    console.log(error.isAxiosError);
    if (error.isAxiosError) {
        const err = error as AxiosError;
        console.log(err.status);
        if (err.response?.status === 404) {
            globalMessage.error(i18nGlobal.t('request.error.404'));
        }
        if (err.response?.status === 403) {
            globalMessage.error(i18nGlobal.t('request.error.403'));
        }
    }
};
