import type { AxiosRequestConfig, RawAxiosRequestHeaders, RawAxiosResponseHeaders } from 'axios';
import axios from 'axios';
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import { filterNull } from '../toolFunction';
import type { FilterNullConifg, UnknownCommonKeyRecord } from '../toolFunction';
import type { Nullable } from '../helper';
import { getForm } from '~/utils/format';
import { globalLoadingBar } from '~/utils/discreteApi';

export const baseUrl = '/api';

export const HttpHeaders = {
    contentType: {
        key: 'Content-Type',
        value: {
            mutipartFormData: 'multipart/form-data',
            applicationXWwwFormUrlencoded: 'application/x-www-form-urlencoded',
            applicationJson: 'application/json',
        },
    },
};

export interface LangParams {
    lang: string;
}

export type RequestConfig = AxiosRequestConfig & {
    progressBar?: LoadingBarApiInjection;
    filterConifg?: FilterNullConifg;
};

export interface FormExtraParams {
    withIndex?: boolean;
    addEmpty?: boolean;
    formType?: 'mutipart' | 'urlencoded';
}

export interface RequestResult {
    code: number;
    message: string;
    data: any;
}

export interface FilteredRequestResult<T> {
    res: T | null;
    err: string | null | boolean;
    code: number;
    msg?: string;
    headers: RawAxiosResponseHeaders;
}

const dataFormatter = <T extends UnknownCommonKeyRecord>(
    data?: T,
    config: FilterNullConifg = {},
) => {
    if (!data) return data;
    const newData = filterNull(data, config);
    return newData;
};

const getFormContentType = (formType?: 'mutipart' | 'urlencoded') => {
    const { mutipartFormData, applicationXWwwFormUrlencoded } = HttpHeaders.contentType.value;
    if (!formType) return mutipartFormData;
    if (formType === 'urlencoded') return applicationXWwwFormUrlencoded;
    return mutipartFormData;
};

const baseRequest = <T = Record<string, any>>(
    config: RequestConfig,
): Promise<FilteredRequestResult<T>> => {
    const progressBar = config.progressBar ?? globalLoadingBar;
    const { responseType } = config;
    progressBar.start();
    return axios(config)
        .then((res) => {
            return {
                data: res.data as RequestResult,
                headers: res.headers,
            };
        })
        .then(({ data, headers }) => {
            if (responseType && ['blob'].includes(responseType)) {
                progressBar.finish();
                return {
                    res: data as T,
                    err: null,
                    code: 20000,
                    headers,
                };
            }
            if (data.code === 20000) {
                progressBar.finish();
                return {
                    res: data.data as T,
                    err: null,
                    msg: data.message,
                    code: data.code,
                    headers,
                };
            } else {
                progressBar.error();
                return {
                    res: (data.data as T) ?? null,
                    err: data.message ?? true,
                    msg: data.message,
                    code: data.code,
                    headers,
                };
            }
        });
};

export const request = <T = Record<string, any>>(
    url: string,
    config: Omit<RequestConfig, 'url'>,
) => {
    return baseRequest<T>({
        url,
        ...config,
    });
};

export const getRequest = <T = Record<string | number, unknown>, R = Record<string, any>>(
    url: string,
    data?: T | Nullable<T>,
    config: Omit<RequestConfig, 'url' | 'method' | 'params'> = {},
) => {
    const { filterConifg } = config;
    return baseRequest<R>({
        url,
        method: 'get',
        params: dataFormatter(data as UnknownCommonKeyRecord, filterConifg),
        paramsSerializer: {
            encode: (p: string) => encodeURIComponent(p),
        },
        ...config,
    });
};

export const deleteRequest = <T = Record<string | number, unknown>, R = Record<string, any>>(
    url: string,
    data?: T | Nullable<T>,
    config: Omit<RequestConfig, 'url' | 'params' | 'method'> = {},
) => {
    const { filterConifg } = config;
    return baseRequest<R>({
        url,
        method: 'delete',
        params: dataFormatter(data as UnknownCommonKeyRecord, filterConifg),
        paramsSerializer: {
            encode: (p: string) => encodeURIComponent(p),
        },
        ...config,
    });
};

export const postRequest = <T = Record<string | number, unknown>, R = Record<string, any>>(
    url: string,
    data?: T | Nullable<T>,
    config: Omit<RequestConfig, 'url' | 'data' | 'method'> = {},
) => {
    const { filterConifg } = config;
    return baseRequest<R>({
        url,
        method: 'post',
        data: dataFormatter(data as UnknownCommonKeyRecord, filterConifg),
        ...config,
    });
};

export const postForm = <T = Record<string | number, unknown>, R = Record<string, any>>(
    url: string,
    data?: T | Nullable<T>,
    config: Omit<RequestConfig & FormExtraParams, 'url' | 'data' | 'method'> = {},
) => {
    const { formType, filterConifg } = config;
    const formattedData = dataFormatter(data as UnknownCommonKeyRecord, filterConifg ?? {});
    let form: string | FormData;
    if (!formType || formType === 'mutipart')
        form = getForm(formattedData ?? {}, config.withIndex, config.addEmpty);
    else form = new URLSearchParams(formattedData as Record<string, string>).toString();
    const contentType = getFormContentType(formType);
    Reflect.deleteProperty(config, 'addEmpty');
    Reflect.deleteProperty(config, 'withIndex');
    return baseRequest<R>({
        url,
        method: 'post',
        data: form,
        ...config,
        headers: {
            'Content-Type': contentType,
            ...config.headers,
        } as RawAxiosRequestHeaders,
    });
};

export const putRequest = <T = Record<string | number, unknown>, R = Record<string, any>>(
    url: string,
    data?: T | Nullable<T>,
    config: Omit<RequestConfig, 'url' | 'data' | 'method'> = {},
) => {
    const { filterConifg } = config;
    return baseRequest<R>({
        url,
        method: 'put',
        data: dataFormatter(data as UnknownCommonKeyRecord, filterConifg),
        ...config,
    });
};

export const putForm = <T = Record<string | number, unknown>, R = Record<string, any>>(
    url: string,
    data?: T | Nullable<T>,
    config: Omit<RequestConfig & FormExtraParams, 'url' | 'data' | 'method'> = {},
) => {
    const { formType, filterConifg } = config;
    const formattedData = dataFormatter(data as UnknownCommonKeyRecord, filterConifg ?? {});
    let form: string | FormData;
    if (!formType || formType === 'mutipart')
        form = getForm(formattedData ?? {}, config.withIndex, config.addEmpty);
    else form = new URLSearchParams(formattedData as Record<string, string>).toString();
    const contentType = getFormContentType(formType);
    Reflect.deleteProperty(config, 'addEmpty');
    Reflect.deleteProperty(config, 'withIndex');
    return baseRequest<R>({
        url,
        method: 'put',
        data: form,
        ...config,
        headers: {
            'Content-Type': contentType,
            ...config.headers,
        } as RawAxiosRequestHeaders,
    });
};
