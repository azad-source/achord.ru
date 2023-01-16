/** Получаем токен авторизации */
export const getAuthToken = (): { access: string; refresh: string } =>
    localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        ? JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY') || '') || null
        : '';
