import * as React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { login, UserClient } from 'redux/api/UserClient';
import { GoogleLogo } from 'components/shared/icons/GoogleLogo';
import styles from './AuthGoogle.module.scss';

export const AuthGoogle = () => {
    const signIn = useGoogleLogin({
        onSuccess: (response) => {
            const formData = new FormData();
            formData.append('access_token', response.access_token);
            UserClient.loginViaGoogle(formData).then((res) => {
                login(res);
            });
        },
    });

    return (
        <button className={styles.googleAuth__btn} onClick={() => signIn()} title="google">
            <GoogleLogo />
        </button>
    );
};
