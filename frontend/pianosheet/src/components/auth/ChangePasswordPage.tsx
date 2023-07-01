import { Page } from 'components/shared/layout/Page/Page';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './ChangePasswordPage.module.scss';
import { Input } from 'components/shared/Input/Input';
import { Button } from 'components/shared/Button/Button';
import { useChangePasswordMutation } from 'redux/api';

type ChangePasswordType = {
    isChangedPassword: boolean;
    message?: string[];
};

export const ChangePasswordPage = () => {
    const [changePassword] = useChangePasswordMutation();

    const { uid, token } = useParams<{ uid: string; token: string }>();
    const [form, setForm] = React.useState<{
        new_password: string;
        re_new_password: string;
        error: Nullable<string[]>;
    }>({ new_password: '', re_new_password: '', error: [] });
    const [changePass, setChangePass] = React.useState<ChangePasswordType>({
        isChangedPassword: false,
    });

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        const { new_password, re_new_password } = form;
        if (uid && token) {
            changePassword({ uid, token, new_password, re_new_password })
                .unwrap()
                .then((res) => setChangePass(res));
        }
    };

    const validation = () => {
        setForm((prev) => {
            let error: string[] = [];
            const pass = prev.new_password;
            const re_pass = prev.re_new_password;

            if (!/[a-z]/.test(pass)) error.push('Пароль должен содержать латинские буквы.');
            if (!/[0-9]/.test(pass)) error.push('Пароль должен содержать цифры');
            if (!/[A-Z]/.test(pass))
                error.push('Должна быть хотябы одна буква в верхнем регистре.');
            if (pass.length < 6) error.push('Длина пароли должна быть не менее 6 символов.');
            if (pass !== re_pass) error.push('Ввденные пароли не совпадают.');

            return {
                ...prev,
                error,
            };
        });
    };

    type HandlerInput = (event: React.ChangeEvent<HTMLInputElement>) => void;

    const handleChangeInput = (targetName: string): HandlerInput => {
        return (event) => {
            setForm((prev) => ({ ...prev, [targetName]: event.target.value }));
            validation();
            setChangePass({ isChangedPassword: false, message: [] });
        };
    };

    return (
        <Page hideSheetsNav className={styles.root}>
            <h1>Смена пароля</h1>
            {changePass.isChangedPassword ? (
                <div className={styles.successChanePass}>
                    <div>Пароль успешно изменен!</div>
                    <br />
                    <div>
                        Перейти на{' '}
                        <Link to="/" className={styles.link}>
                            Главную страницу
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <form onSubmit={(e) => handleChangePassword(e)}>
                        <Input
                            value={form.new_password}
                            onChange={handleChangeInput('new_password')}
                            required
                            autoFocus
                            className={styles.input}
                            type="password"
                        />
                        <Input
                            value={form.re_new_password}
                            onChange={handleChangeInput('re_new_password')}
                            required
                            autoFocus
                            className={styles.input}
                            type="password"
                        />
                        <Button disabled={!!form.error?.length}>Сохранить</Button>
                    </form>
                    <div className={styles.error}>
                        <ol>
                            {form.error?.map((er) => (
                                <li key={er}>{er}</li>
                            ))}
                        </ol>
                    </div>
                    <div className={styles.error}>
                        <ol>
                            {changePass.message?.map((er) => (
                                <div key={er}>{er}</div>
                            ))}
                        </ol>
                    </div>
                </>
            )}
        </Page>
    );
};
