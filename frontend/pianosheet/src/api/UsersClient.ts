import { SocialLinksJsModel, TokenJsModel } from 'domain/api/JsModels';
import { api, retrieveData } from './apiConfig';
import { createAuthProvider } from 'react-token-auth';
import { AxiosResponse } from 'axios';

const apiPath = `/auth`;

export const headers = () => {
    const token: { access: string; refresh: string } = localStorage.getItem(
        'REACT_TOKEN_AUTH_KEY',
    )
        ? JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY') || '') || null
        : '';

    const socialToken = localStorage.getItem('Token');

    let Authorization: string = `JWT ${token && token.access}`;

    if (socialToken) Authorization = `Token ${socialToken && socialToken}`;

    return { Authorization };
};

export const [useAuth, authFetch, login, logout] = createAuthProvider<{
    accessToken: string;
    refreshToken: string;
}>({
    accessTokenKey: 'accessToken',
    onUpdateToken: (token) =>
        fetch('/update-token', {
            method: 'POST',
            body: token.refreshToken,
        }).then((r) => r.json()),
});

export class UsersClient {
    /** Регистрация на сайте */
    public static register(params: FormData): Promise<TokenJsModel> {
        return api.post(`${apiPath}/users/`, params).then(retrieveData);
    }

    /** Авторизация на сайте */
    public static login(params: FormData): Promise<TokenJsModel> {
        return api.post(`${apiPath}/jwt/create/`, params).then(retrieveData);
    }

    /** Авторизация через гугл */
    public static loginViaGoogle(params: FormData): Promise<TokenJsModel> {
        return api.post(`${apiPath}/jwt/create/google/`, params).then(retrieveData);
    }

    /** Выход с сайта */
    public static logout(): Promise<string> {
        localStorage.removeItem('Token');
        return api.get(`${apiPath}/logout/`).then(retrieveData);
    }

    /** Получение данных пользователя */
    public static getUserData(): Promise<string> {
        return api.get(`${apiPath}/users/me/`).then(retrieveData);
    }

    /** Получение ссылок авторизации в соц сетях */
    public static getSocialLinksAuth(): Promise<SocialLinksJsModel> {
        return api.get(`${apiPath}/social/links/`).then(retrieveData);
    }

    /** Авторизация в VK */
    public static authorizationVk(params: FormData): Promise<boolean> {
        return api.post(`${apiPath}/convert-token/`, params).then(retrieveData);
    }

    /** Подтверждение регистрации (почты) */
    public static accountActivation(params: FormData): Promise<AxiosResponse> {
        return api.post(`${apiPath}/users/activation/`, params);
    }

    /** Отправка письма со ссылкой сброса пароля */
    public static resetPassword(params: FormData): Promise<AxiosResponse> {
        return api.post(`${apiPath}/users/reset_password/`, params);
    }

    /** Смена пароля */
    public static changePassword(params: FormData): Promise<AxiosResponse> {
        return api.post(`${apiPath}/users/reset_password_confirm/`, params);
    }
}
