import type { RawAxiosRequestHeaders } from 'axios';
import axios from 'axios';
import { httpErrorHandler } from '~/utils/http/handler';
import { i18nGlobal } from '~/utils/i18n';
import { useAuthToken } from '~/utils/token';

export const setTimeZone = async () => {
    axios.defaults.headers.common['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const initAxios = () => {
    const { authToken } = useAuthToken();
    axios.interceptors.response.use(
        (cnf) => {
            return cnf;
        },
        (error) => {
            httpErrorHandler(error);
            return error;
        },
    );
    axios.interceptors.request.use((cnf) => {
        if (!cnf.headers) (cnf.headers as RawAxiosRequestHeaders) = {};
        const headers = cnf.headers as RawAxiosRequestHeaders;
        if (!headers['Accept-Language'])
            headers['Accept-Language'] = i18nGlobal.locale.value as string;
        if (!headers.Authorization && headers.Authorization !== null && authToken.value)
            headers.Authorization = `Bearer ${authToken.value}`;
        return cnf;
    });
};

export const setToken = async (token: string) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const setLanguage = async (locale: string) => {
    axios.defaults.headers.common['Accept-Language'] = locale;
};
