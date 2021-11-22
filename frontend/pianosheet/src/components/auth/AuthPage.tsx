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
import {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    useGoogleLogin,
} from 'react-google-login';
import { GoogleLogo } from 'components/shared/icons/GoogleLogo';

interface Props {
    status: QueryStatus;
    registration: (email: string, password: string) => Promise<void>;
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

    const loginHandler = (email: string, password: string, event: React.FormEvent) => {
        event.preventDefault();
        authorization(email, password);
    };

    const registerHandler = (
        email: string,
        password: string,
        event: React.FormEvent,
    ): Promise<void> => {
        event.preventDefault();
        return registration(email, password);
    };

    const logoutHandler = () => {
        logout();
        window.location.href = '/sign-in';
    };

    React.useEffect(() => {
        document.title = `${SiteName} - ${isRegForm ? 'Регистрация' : 'Авторизация'}`;
        dropError();
    }, [isRegForm]);

    const handleRegConfirm = (isSuccessRegistration: boolean, email: string) => {
        setRegEvent({ isSuccessRegistration, email });
    };

    const clientId = '844071563925-p3pqgvpvf37tf9dvi96saahu98k7s6c1.apps.googleusercontent.com';
    const redirectUri = 'https://achord.ru/oauth/google/';
    const scope = 'https://www.googleapis.com/auth/userinfo.email';
    const responseType = 'token';

    const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log(response);
        if ('accessToken' in response) {
            const formData = new FormData();
            // formData.append('email', response.profileObj.email);
            // formData.append('password', response.profileObj.);
            formData.append('access_token', response.accessToken);
            UsersClient.loginViaGoogle(formData).then(res => {
                console.log('res', res);
            });
        }
    };

    const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log(response);
    };

    const { signIn, loaded } = useGoogleLogin({
        onSuccess,
        // onAutoLoadFinished,
        clientId,
        cookiePolicy: 'single_host_origin',
        // loginHint,
        // hostedDomain,
        // autoLoad,
        isSignedIn: true,
        // fetchBasicProfile,
        redirectUri,
        // discoveryDocs,
        onFailure,
        // uxMode,
        scope,
        // accessType,
        responseType,
        // jsSrc,
        // onRequest,
        // prompt,
    });

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

                        <Button use="link" onClick={logoutHandler}>
                            Выйти
                        </Button>
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
                    />
                )}

                <button className={styles.socialItem} onClick={signIn} title="google">
                    <GoogleLogo className={styles.socialIcon} />
                </button>
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
