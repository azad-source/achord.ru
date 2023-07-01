import { SocialLinksJsModel, TokenJsModel, UserJsModel } from 'domain/api/JsModels';
import { TagsEnum } from 'redux/api';
import { BuildType, login, transformErrorResponse } from 'redux/apiConfig';
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

// Define a service using a base URL and expected endpoints
export const userEndpoints = (builder: BuildType) => ({
    /** Регистрация на сайте */
    register: builder.mutation<TokenJsModel, RegisterRequest>({
        query: ({ email, password, rePassword: re_password }) => {
            localStorage.removeItem('Token');
            let formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('re_password', re_password);
            return { url: `${baseUrl}/users/`, method: 'POST', body: formData };
        },
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Users],
    }),
    /** Авторизация на сайте */
    authorization: builder.mutation<TokenJsModel, LoginRequest>({
        query: ({ email, password }) => {
            localStorage.removeItem('Token');
            let formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            return { url: `${baseUrl}/jwt/create/`, method: 'POST', body: formData };
        },
        transformResponse: loginTransformResponse,
        transformErrorResponse,
    }),
    /** Авторизация через гугл */
    loginViaGoogle: builder.mutation<TokenJsModel, LoginGoogleRequest>({
        query: ({ accessToken }) => {
            const formData = new FormData();
            formData.append('access_token', accessToken);
            return { url: `${baseUrl}/jwt/create/google/`, method: 'POST', body: formData };
        },
        transformResponse: loginTransformResponse,
        transformErrorResponse,
    }),
    /** Получение данных пользователя */
    getUserData: builder.query<UserJsModel, void>({
        query: () => ({ url: `${baseUrl}/users/me/` }),
        transformErrorResponse,
    }),
    /** Получение ссылок авторизации в соц сетях */
    getSocialLinksAuth: builder.query<SocialLinksJsModel, void>({
        query: () => ({ url: `${baseUrl}/social/links/` }),
        transformErrorResponse,
    }),
    /** Авторизация в VK */
    // TODO: any заменить на конкретный тип
    accountActivation: builder.mutation<any, AccountActivationRequest>({
        query: ({ userId, token }) => {
            let formData = new FormData();
            formData.append('uid', userId);
            formData.append('token', token);
            return { url: `${baseUrl}/users/activation/`, method: 'POST', body: formData };
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
            return { url: `${baseUrl}/users/reset_password/`, method: 'POST', body: formData };
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
            return {
                url: `${baseUrl}/users/reset_password_confirm/`,
                method: 'POST',
                body: formData,
            };
        },
        transformResponse: () => {
            return { isChangePassword: true };
        },
        transformErrorResponse,
    }),
});
