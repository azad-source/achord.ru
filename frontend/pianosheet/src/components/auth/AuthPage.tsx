import * as React from 'react';
import { Authorization } from 'components/shared/layout/Auth/Authorization';
import { Page } from 'components/shared/layout/Page/Page';
import styles from './AuthPage.module.scss';
import { Registration } from 'components/shared/layout/Auth/Registration';
import { SiteName } from 'domain/SiteInfo';
import { SocialAuthParams } from 'domain/api/JsModels';
import { useNavigate } from 'react-router-dom';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { Button } from 'components/shared/Button/Button';
import {
    logout,
    useAuth,
    useAuthorizationMutation,
    useLazyGetSocialLinksAuthQuery,
    useRegisterMutation,
    useResetPasswordMutation,
} from 'redux/api/userApi';

export const AuthPage = () => {
    const [getSocialLinksAuth] = useLazyGetSocialLinksAuthQuery();
    const [authorization, { error: authorizationError, isLoading: isAuthorizationLoading }] =
        useAuthorizationMutation();
    const [registration, { error: registrtionError }] = useRegisterMutation();
    const [resetPassword] = useResetPasswordMutation();

    const navigate = useNavigate();

    const [logged] = useAuth();
    const [isRegForm, setIsRegForm] = React.useState<boolean>(false);
    const [regEvent, setRegEvent] = React.useState<{
        isSuccessRegistration: boolean;
        email?: string;
    }>({ isSuccessRegistration: false });

    React.useEffect(() => {
        document.title = `${SiteName} - ${isRegForm ? 'Регистрация' : 'Авторизация'}`;
        // dispatch(dropError());
    }, [isRegForm]);

    const [googleAuth, setGoogleAuth] = React.useState<SocialAuthParams>();

    React.useEffect(() => {
        getSocialLinksAuth()
            .unwrap()
            .then((res) => setGoogleAuth(res.google));
    }, []);

    const loginHandler = (email: string, password: string, event: React.FormEvent) => {
        event.preventDefault();
        authorization({ email, password });
    };

    const registerHandler = (
        email: string,
        password: string,
        rePassword: string,
        event: React.FormEvent,
    ) => {
        event.preventDefault();
        return registration({ email, password, rePassword }).unwrap();
    };

    const resetPasswordHandler = (email: string) => {
        return resetPassword({ email }).unwrap();
    };

    const handleRegConfirm = (isSuccessRegistration: boolean, email: string) => {
        setRegEvent({ isSuccessRegistration, email });
    };

    return (
        <Page hideSheetsNav>
            <div className={styles.root}>
                {logged ? (
                    <div className={styles.successAuth}>
                        {regEvent.isSuccessRegistration ? (
                            <TextPlain className={styles.successAuthMsg}>
                                Регистрация прошла успешно! <br />
                                На <a href={`mailto:${regEvent.email}`}>{regEvent.email}</a>{' '}
                                отправлено письмо со сылкой для подтверждения Вашей почты.
                            </TextPlain>
                        ) : (
                            <TextPlain className={styles.successAuthMsg}>
                                Вы авторизованы!
                            </TextPlain>
                        )}

                        <div className={styles.linkWrapper}>
                            <Button
                                onClick={() => navigate('/')}
                                className={styles.button}
                                use="transparent"
                            >
                                Главная
                            </Button>
                            <Button
                                onClick={() => {
                                    logout();
                                    navigate('/sign-in');
                                }}
                                use="transparent"
                            >
                                Выйти
                            </Button>
                        </div>
                    </div>
                ) : isRegForm ? (
                    <Registration
                        onSwitchForm={setIsRegForm}
                        registerHandler={registerHandler}
                        errorMessage={'' /**registrtionError */}
                        regConfirm={handleRegConfirm}
                    />
                ) : (
                    <Authorization
                        onSwitchForm={setIsRegForm}
                        loginHandler={loginHandler}
                        errorMessage={'' /**authorizationError */}
                        resetPassword={resetPasswordHandler}
                        isLoading={isAuthorizationLoading}
                        googleAuth={googleAuth}
                    />
                )}
            </div>
        </Page>
    );
};
