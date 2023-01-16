import axios, { AxiosError, AxiosResponse } from 'axios';
import { arrToString } from 'utils/arrayTransform';
import { getAuthToken } from 'utils/tokenHelper';
import { headers, logout } from './UserClient';
import qs from 'qs';

const baseURL = 'https://achord.ru';

export const pianosheetURL = '/api/pianosheet';

export const googleAuth = {
    clientId: '844071563925-p3pqgvpvf37tf9dvi96saahu98k7s6c1.apps.googleusercontent.com',
    redirectUri: 'https://achord.ru/oauth/google/',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    responseType: 'token',
    isSignedIn: true,
};

export const api = axios.create({
    baseURL,
    // paramsSerializer: {
    //     encode: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    // },
});

export function retrieveData<T>(result: AxiosResponse<T>): T {
    return result.data;
}

export function errorData(error?: AxiosError): {
    statusText: string;
    reason: string;
    error: Error;
} {
    const statusText: string | undefined = error?.response?.statusText || '';
    const data: any = error?.response?.data;
    let reason: string = '';

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => (reason += '' + arrToString(data[key])));
    } else if (Array.isArray(data)) {
        reason = arrToString(data);
    } else {
        reason = data;
    }

    const _error = error as Error;

    return { statusText, reason, error: _error };
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

let withHeader = [
    '/auth/users/me/',
    '/api/pianosheet/author/favorite/',
    '/api/pianosheet/note/favorite/',
];

if (getAuthToken()?.access) {
    withHeader = [
        ...withHeader,
        '/api/pianosheet/author/',
        '/api/pianosheet/note/',
        '/api/pianosheet/author/random/',
        '/api/pianosheet/note/random/',
    ];
}

const withoutHeader = ['/auth/users/'];

api.interceptors.request.use((config) => {
    const url = config.url || '';

    if ((config.method !== 'get' || withHeader.includes(url)) && !withoutHeader.includes(url)) {
        config.headers = { 'Content-Type': 'multipart/form-data', ...headers() };
    }

    if (process.env.NODE_ENV === 'development') {
        // console.info('✉️ ', config);
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (getAuthToken()?.access && error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    },
);
