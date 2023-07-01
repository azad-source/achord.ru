import * as React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogo } from 'components/shared/icons/GoogleLogo';
import styles from './AuthGoogle.module.scss';
import { useLoginViaGoogleMutation } from 'redux/api';

export const AuthGoogle = () => {
    const [loginViaGoogle] = useLoginViaGoogleMutation();

    const signIn = useGoogleLogin({
        onSuccess: (response) => {
            loginViaGoogle({ accessToken: response.access_token });
        },
    });

    return (
        <button className={styles.googleAuth__btn} onClick={() => signIn()} title="google">
            <GoogleLogo />
        </button>
    );
};
