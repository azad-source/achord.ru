import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { ResponseError } from 'redux/models/sharedModels';
import { getAuthToken } from 'utils/tokenHelper';
import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder, TagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createAuthProvider } from 'react-token-auth';

export const { useAuth, authFetch, login, logout } = createAuthProvider<{
    accessToken: string;
    refreshToken: string;
}>({
    getAccessToken: (session) => session.accessToken,
    onUpdateToken: (token) =>
        fetch('/update-token', {
            method: 'POST',
            body: token.refreshToken,
        }).then((r) => r.json()),
});

export type BuildType = EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
    TagDescription<any>,
    'api'
>;

export const API_URL = 'https://achord.ru/api/pianosheet';

export const URLs = {
    author: '/api/pianosheet/author/',
    sheet: '/api/pianosheet/note/',
    genre: '/api/pianosheet/genre/',
    search: '/api/pianosheet/search/',
    user: '/auth/users/',
};

export const googleAuth = {
    clientId: '844071563925-p3pqgvpvf37tf9dvi96saahu98k7s6c1.apps.googleusercontent.com',
    redirectUri: 'https://achord.ru/oauth/google/',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    responseType: 'token',
    isSignedIn: true,
};

// export const api = axios.create({
//     baseURL: host,
//     // paramsSerializer: {
//     //     encode: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
//     // },
// });

// export function retrieveData<T>(result: AxiosResponse<T>): T {
//     return result.data;
// }

// export function errorData(error?: AxiosError): {
//     statusText: string;
//     reason: string;
//     error: Error;
// } {
//     const statusText: string | undefined = error?.response?.statusText || '';
//     const data: any = error?.response?.data;
//     let reason: string = '';

//     if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
//         Object.keys(data).forEach((key) => (reason += '' + arrToString(data[key])));
//     } else if (Array.isArray(data)) {
//         reason = arrToString(data);
//     } else {
//         reason = data;
//     }

//     const _error = error as Error;

//     return { statusText, reason, error: _error };
// }

// /**
//  * При получении 200 и html вместо ответа апи считается, что это 404 запрос
//  * в апи, который из-за SPA настроек сервера отдал галвную страницу.
//  */
// function spaApiInterceptor(resp: AxiosResponse): Promise<AxiosResponse> {
//     if (
//         resp?.status === 200 &&
//         resp.config.baseURL === host &&
//         resp.headers['content-type'] === 'text/html'
//     ) {
//         const err = new Error('Request failed with status code 404') as AxiosError;
//         err.isAxiosError = true;
//         err.response = {
//             ...resp,
//             status: 404,
//             statusText: 'Not Found',
//             data: '',
//         };
//         err.request = resp.request;

//         return Promise.reject(err);
//     }
//     return Promise.resolve(resp);
// }

// let withHeader = [
//     '/auth/users/me/',
//     '/api/pianosheet/author/favorite/',
//     '/api/pianosheet/note/favorite/',
// ];

// if (getAuthToken()?.access) {
//     withHeader = [
//         ...withHeader,
//         '/api/pianosheet/author/',
//         '/api/pianosheet/note/',
//         '/api/pianosheet/author/random/',
//         '/api/pianosheet/note/random/',
//     ];
// }

// const withoutHeader = ['/auth/users/'];

// api.interceptors.request.use((config) => {
//     const url = config.url || '';

//     if ((config.method !== 'get' || withHeader.includes(url)) && !withoutHeader.includes(url)) {
//         config.headers = { 'Content-Type': 'multipart/form-data', ...headers() };
//     }

//     if (process.env.NODE_ENV === 'development') {
//         // console.info('✉️ ', config);
//     }

//     return config;
// });

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (getAuthToken()?.access && error.response.status === 401) {
//             logout();
//         }
//         return Promise.reject(error);
//     },
// );

export function transformErrorResponse(error: ResponseError) {
    if (getAuthToken()?.access && error.status === 401) {
        logout();
    }
    return error;
}

export function prepareHeaders(
    headers: Headers,
    api: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>,
) {
    const token = getAuthToken();
    const socialToken = localStorage.getItem('Token');
    if (token?.access) headers.set('authorization', `JWT ${token.access}`);
    if (socialToken) headers.set('authorization', `Token ${socialToken}`);
    return headers;
}
