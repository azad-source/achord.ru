import * as React from 'react';
import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import { SiteName } from 'domain/SiteInfo';
import styles from './Authorization.module.scss';
import { Modal } from 'components/shared/Modal/Modal';
import cn from 'classnames';
import { AuthGoogle } from 'components/auth/AuthGoogle';
import { SocialAuthParams } from 'domain/api/JsModels';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { AxiosResponse } from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Loader } from '../Loader/Loader';

interface Props {
    isLoading: boolean;
    errorMessage: string;
    googleAuth?: SocialAuthParams;
    onSwitchForm: (bool: boolean) => void;
    loginHandler: (email: string, password: string, event: React.FormEvent) => void;
    resetPassword: (email: string) => Promise<AxiosResponse<any, any>>;
}

export const Authorization: React.FC<Props> = ({
    isLoading,
    errorMessage,
    googleAuth,
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

    return (
        <Loader className={styles.root} isLoading={isLoading}>
            <TextPlain className={styles.title}>Авторизация на сайте {SiteName}</TextPlain>
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
                    <Button type="submit" className={styles.btnLogin} disabled={isLoading}>
                        Войти
                    </Button>
                    <Button
                        use="transparent"
                        className={styles.btnRegistr}
                        onClick={() => onSwitchForm(true)}
                        disabled={isLoading}
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
                {!!googleAuth && (
                    <GoogleOAuthProvider clientId={googleAuth.clientId}>
                        <AuthGoogle />
                    </GoogleOAuthProvider>
                )}
            </div>

            {!!errorMessage && <div className={styles.errorsMsg}>{errorMessage}</div>}
            {openModalResetPassword && (
                <Modal
                    title="Восстановление пароля"
                    onClose={() => setOpenModalResetPassword(false)}
                    isLoading={isLoading}
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
        </Loader>
    );
};
