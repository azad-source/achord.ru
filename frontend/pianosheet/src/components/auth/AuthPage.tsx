import * as React from 'react';
import { Authorization } from 'components/shared/layout/Auth/Authorization';
import { Page } from 'components/shared/layout/Page/Page';
import styles from './AuthPage.scss';
import { Registration } from 'components/shared/layout/Auth/Registration';
import { logout, useAuth, UsersClient } from 'api/UsersClient';
import { Button } from 'components/shared/Button/Button';
import { SiteName } from 'domain/SiteInfo';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { usersAction } from 'store/usersActions';
import { QueryStatus } from 'domain/QueryStatus';
import { SocialAuthParams } from 'domain/api/JsModels';
import { Link } from 'react-router-dom';

interface Props {
    status: QueryStatus;
    registration: (email: string, password: string, re_password: string) => Promise<void>;
    authorization: (email: string, password: string) => Promise<void>;
    dropError: () => void;
    resetPassword: (email: string) => Promise<void>;
}

const AuthPageFC: React.FC<Props> = ({
    status,
    registration,
    authorization,
    dropError,
    resetPassword,
}) => {
    const [logged] = useAuth();
    const [isRegForm, setIsRegForm] = React.useState<boolean>(false);
    const [regEvent, setRegEvent] = React.useState<{
        isSuccessRegistration: boolean;
        email?: string;
    }>({ isSuccessRegistration: false });

    React.useEffect(() => {
        document.title = `${SiteName} - ${isRegForm ? 'Регистрация' : 'Авторизация'}`;
        dropError();
    }, [isRegForm]);

    const [googleAuth, setGoogleAuth] = React.useState<SocialAuthParams>();

    React.useEffect(() => {
        UsersClient.getSocialLinksAuth().then((res) => setGoogleAuth(res.google));
    }, []);

    const loginHandler = (email: string, password: string, event: React.FormEvent) => {
        event.preventDefault();
        authorization(email, password);
    };

    const registerHandler = (
        email: string,
        password: string,
        re_password: string,
        event: React.FormEvent,
    ): Promise<void> => {
        event.preventDefault();
        return registration(email, password, re_password);
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
                            <div className={styles.successAuthMsg}>
                                Регистрация прошла успешно! <br />
                                На <a href={`mailto:${regEvent.email}`}>{regEvent.email}</a>{' '}
                                отправлено письмо со сылкой для подтверждения Вашей почты.
                            </div>
                        ) : (
                            <div className={styles.successAuthMsg}>Вы авторизованы!</div>
                        )}

                        <div className={styles.linkWrapper}>
                            <Link to="/" className={styles.link}>
                                Главная
                            </Link>
                            <Link to="/sign-in" onClick={logout} className={styles.link}>
                                Выйти
                            </Link>
                        </div>
                    </div>
                ) : isRegForm ? (
                    <Registration
                        onSwitchForm={setIsRegForm}
                        registerHandler={registerHandler}
                        errorMessage={status?.errorMessage}
                        regConfirm={handleRegConfirm}
                    />
                ) : (
                    <Authorization
                        onSwitchForm={setIsRegForm}
                        loginHandler={loginHandler}
                        errorMessage={status?.errorMessage}
                        resetPassword={resetPassword}
                        status={status}
                        googleAuth={googleAuth}
                    />
                )}
            </div>
        </Page>
    );
};

const mapStateToProps = (state: RootState) => {
    return { status: state.users.status };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            registration: usersAction.registration,
            authorization: usersAction.authorization,
            dropError: usersAction.dropError,
            resetPassword: usersAction.resetPassword,
        },
        dispatch,
    );
};

export const AuthPage = connect(mapStateToProps, mapDispatchToProps)(AuthPageFC);
