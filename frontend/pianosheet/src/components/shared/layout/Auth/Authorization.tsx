import * as React from 'react';
import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import { SiteName } from 'domain/SiteInfo';
import styles from './Authorization.module.scss';
import { UsersClient } from 'api/UsersClient';
import { SocialLinkJsModel } from 'domain/api/JsModels';
import { VkLogo } from 'components/shared/icons/VkLogo';
import { OKLogo } from 'components/shared/icons/OKLogo';
import { FacebookLogo } from 'components/shared/icons/FacebookLogo';
import { Modal } from 'components/shared/Modal/Modal';
import { QueryStatus } from 'domain/QueryStatus';
import cn from 'classnames';

const SocialIcons: Record<string, React.ReactNode> = {
    'vk.com': <VkLogo className={styles.socialIcon} />,
    'ok.ru': <OKLogo className={styles.socialIcon} />,
    'facebook.com': <FacebookLogo className={styles.socialIcon} />,
};

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
    const [socialAuth, setSocialAuth] = React.useState<SocialLinkJsModel[]>([]);
    const [openModalResetPassword, setOpenModalResetPassword] = React.useState<boolean>(false);

    React.useEffect(() => {
        UsersClient.getSocialLinksAuth().then((res) => {
            setSocialAuth(res);
        });
    }, []);

    const handleResetPassword = () => {
        resetPassword(email.resetPass).then(() => {
            setEmail((prev) => ({ ...prev, resetPass: '' }));
            setOpenModalResetPassword(false);
        });
    };

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
            <div className={styles.forgotPassword}>
                <Button
                    use="link"
                    onClick={() => setOpenModalResetPassword(true)}
                    className={styles.forgotPassword__button}
                >
                    Забыли пароль?
                </Button>
            </div>
            {/* <div className={styles.socialItems}>
                {socialAuth.map((item) => (
                    <div className={styles.socialItem} key={item.provider}>
                        <a href={item.link} title={item.provider}>
                            {SocialIcons[item.provider]}
                        </a>
                    </div>
                ))}
            </div> */}
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
