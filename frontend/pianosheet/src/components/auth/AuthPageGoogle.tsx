import * as React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AuthPageGoogle.scss';
import { TokenJsModel } from 'domain/api/JsModels';
import { login } from 'redux/api/UserClient';

export const AuthPageGoogle = () => {
    const location = useLocation();

    const [params, setParams] = React.useState<{
        status: string;
        token: string;
    }>({ status: '', token: '' });

    React.useEffect(() => {
        if (location.search) {
            const hashArr = location.search.split('&');
            if (hashArr && hashArr.length > 0) {
                hashArr.map((item) => {
                    if (item.includes('status')) {
                        setParams((previousState) => ({
                            ...previousState,
                            status: item.split('=')[1],
                        }));
                    } else if (item.includes('token')) {
                        setParams((previousState) => ({
                            ...previousState,
                            token: item.split('=')[1],
                        }));
                    }
                });
            }
        }
    }, []);

    React.useEffect(() => {
        if (params.status === 'success' && params.token) {
            localStorage.setItem('Token', params.token);
            const tokenObj: TokenJsModel = {
                accessToken: params.token,
                refreshToken: '',
            };
            login(tokenObj);
            window.location.href = '/';
        }
    }, [params]);

    return <div className={styles.root}>Авторизация vk</div>;
};
