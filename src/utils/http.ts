import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { getForm } from '~/utils/format';

export interface FormExtraParams {
    withIndex?: boolean;
    addEmpty?: boolean;
}

export const request = (url: string, config: Omit<AxiosRequestConfig, 'url'>) => {
    return axios({
        url,
        ...config,
    });
};

export const getRequest = <T extends Record<string, unknown>>(
    url: string,
    data: T,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params'>,
) => {
    return axios({
        url,
        method: 'get',
        params: data,
        ...config,
    });
};

export const deleteRequest = <T extends Record<string, unknown>>(
    url: string,
    data: T,
    config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>,
) => {
    return axios({
        url,
        method: 'delete',
        params: data,
        ...config,
    });
};

export const postRequest = <T extends Record<string, unknown>>(
    url: string,
    data: T,
    config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>,
) => {
    return axios({
        url,
        method: 'post',
        data,
        ...config,
    });
};

export const postForm = <T extends Record<string, unknown>>(
    url: string,
    data: T,
    config: Omit<AxiosRequestConfig & FormExtraParams, 'url' | 'data' | 'method'> = {},
) => {
    const form = getForm(data, config.withIndex, config.addEmpty);
    delete config.addEmpty;
    delete config.withIndex;
    return axios({
        url,
        method: 'post',
        data: form,
        ...config,
    });
};

export const putRequest = <T extends Record<string, unknown>>(
    url: string,
    data: T,
    config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>,
) => {
    return axios({
        url,
        method: 'put',
        data,
        ...config,
    });
};

export const putForm = <T extends Record<string, unknown>>(
    url: string,
    data: T,
    config: Omit<AxiosRequestConfig & FormExtraParams, 'url' | 'data' | 'method'> = {},
) => {
    const form = getForm(data, config.withIndex, config.addEmpty);
    delete config.addEmpty;
    delete config.withIndex;
    return axios({
        url,
        method: 'put',
        data: form,
        ...config,
    });
};
