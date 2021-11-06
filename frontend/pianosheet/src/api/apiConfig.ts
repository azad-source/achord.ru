import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { arrToString } from 'utils/arrayTransform';
import { buildSearchString } from '../utils/urlHelpers';

const baseURL = 'https://achord.ru';

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
        Object.keys(data).forEach(
            (key) => (reason += '' + arrToString(data[key])),
        );
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
        const err = new Error(
            'Request failed with status code 404',
        ) as AxiosError;
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

/**
 * Клеит к запросам время, чтобы ИЕ не использовал кеши ответов.
 */
function ieCachePreventInterceptor(
    config: AxiosRequestConfig,
): AxiosRequestConfig {
    // Сначала сделал через paramsSerializer, но логично оказалось, что он не вызывается в запросах без params.
    // А кеш блокировать все равно надо.
    config.params = config.params || {};
    config.params._t = new Date().getTime();
    return config;
}

api.interceptors.request.use((req) => ieCachePreventInterceptor(req));
