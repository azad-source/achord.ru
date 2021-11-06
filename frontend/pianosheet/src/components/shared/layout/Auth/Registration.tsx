import * as React from 'react';
import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import styles from './Registration.module.scss';
import { SiteName } from 'domain/SiteInfo';

interface Props {
    errorMessage: string;
    onSwitchForm: (bool: boolean) => void;
    registerHandler: (
        email: string,
        password: string,
        event: React.FormEvent,
    ) => Promise<void>;
    regConfirm: (isSuccessRegistration: boolean, email: string) => void;
}

export const Registration: React.FC<Props> = ({
    errorMessage,
    onSwitchForm,
    registerHandler,
    regConfirm,
}) => {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
        registerHandler(email, password, e).then(() => regConfirm(true, email));
    };

    return (
        <div className={styles.root}>
            <div className={styles.title}>Регистрация на сайте {SiteName}</div>
            <form onSubmit={handleRegistration}>
                <Input
                    placeholder="E-mail"
                    className={styles.input}
                    value={email}
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                    }
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    className={styles.input}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                />
                <div className={styles.btnsWrapper}>
                    <Button
                        type="submit"
                        className={styles.btnLogin}
                        disabled={false}
                    >
                        Создать
                    </Button>
                    <Button
                        use="transparent"
                        className={styles.btnRegistr}
                        onClick={() => onSwitchForm(false)}
                    >
                        Авторизация
                    </Button>
                </div>
            </form>
            {!!errorMessage && (
                <div className={styles.errorsMsg}>{errorMessage}</div>
            )}
        </div>
    );
};
