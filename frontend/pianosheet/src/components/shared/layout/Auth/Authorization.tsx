import * as React from 'react';
import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import { SiteName } from 'domain/SiteInfo';
import styles from './Authorization.module.scss';
import { Modal } from 'components/shared/Modal/Modal';
import { QueryStatus } from 'domain/QueryStatus';
import cn from 'classnames';
import { GoogleLogo } from 'components/shared/icons/GoogleLogo';
import {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
    useGoogleLogin,
} from 'react-google-login';
import { login, UsersClient } from 'api/UsersClient';
import { googleAuth } from 'api/apiConfig';

interface Props {
    status: QueryStatus;
    errorMessage: string;
    onSwitchForm: (bool: boolean) => void;
    loginHandler: (email: string, password: string, event: React.FormEvent) => void;
    resetPassword: (email: string) => Promise<void>;
}

export const Authorization: React.FC<Props> = ({
    status,
    errorMessage,
    onSwitchForm,
    loginHandler,
    resetPassword,
}) => {
    const [email, setEmail] = React.useState<{
        auth: string;
        resetPass: string;
    }>({ auth: '', resetPass: '' });
    const [password, setPassword] = React.useState<string>('');
    const [openModalResetPassword, setOpenModalResetPassword] = React.useState<boolean>(false);

    const handleResetPassword = () => {
        resetPassword(email.resetPass).then(() => {
            setEmail((prev) => ({ ...prev, resetPass: '' }));
            setOpenModalResetPassword(false);
        });
    };

    const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log('accessToken', response);
        if ('accessToken' in response) {
            const formData = new FormData();
            formData.append('access_token', response.accessToken);
            UsersClient.loginViaGoogle(formData).then((res) => {
                console.log('res', res);
                login(res);
            });
        }
    };

    const { signIn } = useGoogleLogin({
        onSuccess,
        clientId: googleAuth.clientId,
        isSignedIn: googleAuth.isSignedIn,
        redirectUri: googleAuth.redirectUri,
        scope: googleAuth.scope,
        responseType: googleAuth.responseType,
    });

    return (
        <div className={styles.root}>
            <div className={styles.title}>Авторизация на сайте {SiteName}</div>
            <form onSubmit={(e) => loginHandler(email.auth, password, e)}>
                <Input
                    placeholder={'E-mail'}
                    className={styles.input}
                    value={email.auth}
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail((prev) => ({ ...prev, auth: e.target.value }))
                    }
                />
                <Input
                    type="password"
                    placeholder={'Пароль'}
                    className={styles.input}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                />
                <div className={styles.btnsWrapper}>
                    <Button type="submit" className={styles.btnLogin} disabled={false}>
                        Войти
                    </Button>
                    <Button
                        use="transparent"
                        className={styles.btnRegistr}
                        onClick={() => onSwitchForm(true)}
                    >
                        Регистрация
                    </Button>
                </div>
            </form>
            <div className={styles.bottomPanel}>
                <div className={styles.forgotPassword}>
                    <Button
                        use="link"
                        onClick={() => setOpenModalResetPassword(true)}
                        className={styles.forgotPassword__button}
                    >
                        Забыли пароль?
                    </Button>
                </div>
                <button className={styles.googleAuth__btn} onClick={signIn} title="google">
                    <GoogleLogo />
                </button>
            </div>

            {!!errorMessage && <div className={styles.errorsMsg}>{errorMessage}</div>}
            {openModalResetPassword && (
                <Modal
                    title="Восстановление пароля"
                    onClose={() => setOpenModalResetPassword(false)}
                    loadStatus={status}
                    bottomPanel={<Button onClick={handleResetPassword}>Восстановить</Button>}
                >
                    <Input
                        width="400px"
                        placeholder="e-mail"
                        onChange={(e: any) =>
                            setEmail((prev) => ({
                                ...prev,
                                resetPass: e.target.value,
                            }))
                        }
                        value={email.resetPass}
                        required
                        className={cn(styles.input, styles.resetPassword)}
                        autoFocus
                    />
                </Modal>
            )}
        </div>
    );
};
