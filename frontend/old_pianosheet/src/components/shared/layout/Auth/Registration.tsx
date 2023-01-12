import * as React from 'react';
import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import styles from './Registration.module.scss';
import { SiteName } from 'domain/SiteInfo';
import { Link } from 'components/shared/Link/Link';
import { Modal } from 'components/shared/Modal/Modal';
import { Privacy } from 'components/shared/Privacy/Privacy';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';

interface Props {
    errorMessage: string;
    onSwitchForm: (bool: boolean) => void;
    registerHandler: (
        email: string,
        password: string,
        re_password: string,
        event: React.FormEvent,
    ) => Promise<void>;
    regConfirm: (isSuccessRegistration: boolean, email: string) => void;
}

type InputType = React.ChangeEvent<HTMLInputElement>;

const onPrivacy = true;

export const Registration: React.FC<Props> = ({
    errorMessage,
    onSwitchForm,
    registerHandler,
    regConfirm,
}) => {
    const [form, setForm] = React.useState<{
        email: string;
        password: string;
        re_password: string;
        privacy: boolean;
    }>({
        email: '',
        password: '',
        re_password: '',
        privacy: false,
    });

    const [showPrivacyModal, setShowPrivacyModal] = React.useState<boolean>(false);

    const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
        registerHandler(form.email, form.password, form.re_password, e).then(() =>
            regConfirm(true, form.email),
        );
    };

    const handlePrivacy = (e: InputType) => {
        setForm({ ...form, privacy: e.target.checked });
    };

    const closePrivacyModal = () => {
        setForm({ ...form, privacy: false });
        setShowPrivacyModal(false);
    };
    const openPrivacyModal = () => setShowPrivacyModal(true);
    const applyPrivacy = () => {
        setForm({ ...form, privacy: true });
        setShowPrivacyModal(false);
    };

    const btnDisabled =
        (onPrivacy && !form.privacy) || !form.email || !form.password || !form.re_password;

    return (
        <div className={styles.root}>
            <TextPlain className={styles.title}>Регистрация на сайте {SiteName}</TextPlain>
            <form onSubmit={handleRegistration}>
                <Input
                    placeholder="E-mail"
                    className={styles.input}
                    value={form.email}
                    autoFocus
                    onChange={(e: InputType) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    className={styles.input}
                    value={form.password}
                    onChange={(e: InputType) => setForm({ ...form, password: e.target.value })}
                />
                <Input
                    type="password"
                    placeholder="Повторите пароль"
                    className={styles.input}
                    value={form.re_password}
                    onChange={(e: InputType) => setForm({ ...form, re_password: e.target.value })}
                />
                {onPrivacy && (
                    <label className={styles.privacy}>
                        <Input
                            type="checkbox"
                            placeholder="Политика обработки персональных данных"
                            className={styles.privacy__checkbox}
                            checked={form.privacy}
                            onChange={handlePrivacy}
                        />
                        <Button
                            size="small"
                            onClick={openPrivacyModal}
                            className={styles.link}
                            use="link"
                        >
                            Даю свое согласие на обработку персональных данных
                        </Button>
                    </label>
                )}

                <div className={styles.btnsWrapper}>
                    <Button type="submit" className={styles.btnLogin} disabled={btnDisabled}>
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
            {!!errorMessage && <div className={styles.errorsMsg}>{errorMessage}</div>}
            {showPrivacyModal && (
                <Modal
                    title="Политика обработки персональных данных"
                    onClose={closePrivacyModal}
                    bottomPanel={
                        <>
                            <Button onClick={applyPrivacy}>Принять</Button>
                            <Button use="link" onClick={closePrivacyModal}>
                                Отменить
                            </Button>
                        </>
                    }
                    setScroll
                >
                    <Link href="/privacy" target="_blank">
                        Открыть отдельной страницей
                    </Link>
                    <Privacy />
                </Modal>
            )}
        </div>
    );
};
