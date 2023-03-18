import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SocialLinksJsModel, TokenJsModel, UserJsModel } from 'domain/api/JsModels';
import { createAuthProvider } from 'react-token-auth';
import { API_URL, prepareHeaders, transformErrorResponse } from 'redux/api/apiConfig';
import {
    AccountActivationRequest,
    ChangePasswordRequest,
    LoginGoogleRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
} from 'redux/models/userModels';

const HOST = 'https://achord.ru';

const baseUrl = `${HOST}/auth`;

const loginTransformResponse = (res: TokenJsModel) => {
    login(res);
    return res;
};

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

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    tagTypes: ['Users', 'User'],
    endpoints: (builder) => ({
        /** Регистрация на сайте */
        register: builder.mutation<TokenJsModel, RegisterRequest>({
            query: ({ email, password, rePassword: re_password }) => {
                localStorage.removeItem('Token');
                let formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                formData.append('re_password', re_password);
                return { url: '/users/', method: 'POST', body: formData };
            },
            transformErrorResponse,
            invalidatesTags: (res) => ['Users'],
        }),
        /** Авторизация на сайте */
        authorization: builder.mutation<TokenJsModel, LoginRequest>({
            query: ({ email, password }) => {
                localStorage.removeItem('Token');
                let formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                return { url: '/jwt/create/', method: 'POST', body: formData };
            },
            transformResponse: loginTransformResponse,
            transformErrorResponse,
        }),
        /** Авторизация через гугл */
        loginViaGoogle: builder.mutation<TokenJsModel, LoginGoogleRequest>({
            query: ({ accessToken }) => {
                const formData = new FormData();
                formData.append('access_token', accessToken);
                return { url: '/jwt/create/google/', method: 'POST', body: formData };
            },
            transformResponse: loginTransformResponse,
            transformErrorResponse,
        }),
        /** Получение данных пользователя */
        getUserData: builder.query<UserJsModel, void>({
            query: () => ({ url: '/users/me/' }),
            transformErrorResponse,
        }),
        /** Получение ссылок авторизации в соц сетях */
        getSocialLinksAuth: builder.query<SocialLinksJsModel, void>({
            query: () => ({ url: '/social/links/' }),
            transformErrorResponse,
        }),
        /** Авторизация в VK */
        // TODO: any заменить на конкретный тип
        accountActivation: builder.mutation<any, AccountActivationRequest>({
            query: ({ userId, token }) => {
                let formData = new FormData();
                formData.append('uid', userId);
                formData.append('token', token);
                return { url: '/users/activation/', method: 'POST', body: formData };
            },
            transformResponse: (res, meta, arg) => {
                return { id: arg.userId, token: arg.token };
            },
            transformErrorResponse,
        }),
        /** Отправка письма со ссылкой сброса пароля */
        resetPassword: builder.mutation<any, ResetPasswordRequest>({
            query: ({ email }) => {
                let formData = new FormData();
                formData.append('email', email);
                return { url: '/users/reset_password/', method: 'POST', body: formData };
            },
            transformErrorResponse,
        }),
        /** Смена пароля */
        changePassword: builder.mutation<any, ChangePasswordRequest>({
            query: ({ uid, token, new_password, re_new_password }) => {
                let formData = new FormData();
                formData.append('uid', uid);
                formData.append('token', token);
                formData.append('new_password', new_password);
                formData.append('re_new_password', re_new_password);
                return { url: '/users/reset_password_confirm/', method: 'POST', body: formData };
            },
            transformResponse: () => {
                return { isChangePassword: true };
            },
            transformErrorResponse,
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useRegisterMutation,
    useLoginViaGoogleMutation,
    useLazyGetSocialLinksAuthQuery,
    useAuthorizationMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useAccountActivationMutation,
    useLazyGetUserDataQuery,
} = userApi;
