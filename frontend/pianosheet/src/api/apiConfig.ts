import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { arrToString } from 'utils/arrayTransform';
import { buildSearchString } from '../utils/urlHelpers';
import { headers } from './UsersClient';

const baseURL = 'https://achord.ru';

export const googleAuth = {
    clientId: '844071563925-p3pqgvpvf37tf9dvi96saahu98k7s6c1.apps.googleusercontent.com',
    redirectUri: 'https://achord.ru/oauth/google/',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    responseType: 'token',
    isSignedIn: true,
};

const api = axios.create({
    baseURL,
    paramsSerializer: buildSearchString,
});

export { api };

export function retrieveData<T>(result: AxiosResponse<T>): T {
    return result.data;
}

export function errorData(error: AxiosError): {
    statusText: string;
    reason: string;
    error: Error;
} {
    const statusText: string | undefined = error.response?.statusText || '';
    const data: any = error.response?.data;
    let reason: string = '';

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => (reason += '' + arrToString(data[key])));
    } else if (Array.isArray(data)) {
        reason = arrToString(data);
    } else {
        reason = data;
    }

    return { statusText, reason, error };
}

/**
 * При получении 200 и html вместо ответа апи считается, что это 404 запрос
 * в апи, который из-за SPA настроек сервера отдал галвную страницу.
 */
function spaApiInterceptor(resp: AxiosResponse): Promise<AxiosResponse> {
    if (
        resp?.status === 200 &&
        resp.config.baseURL === baseURL &&
        resp.headers['content-type'] === 'text/html'
    ) {
        const err = new Error('Request failed with status code 404') as AxiosError;
        err.isAxiosError = true;
        err.response = {
            ...resp,
            status: 404,
            statusText: 'Not Found',
            data: '',
        };
        err.request = resp.request;

        return Promise.reject(err);
    }
    return Promise.resolve(resp);
}

function ieCachePreventInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    if (config.method !== 'get') {
        config.headers = {
            'Content-Type': 'multipart/form-data',
            ...headers(),
        };
    }

    if (process.env.NODE_ENV === 'development') {
        console.info('✉️ ', config);
    }

    return config;
}

api.interceptors.request.use((req) => ieCachePreventInterceptor(req));
