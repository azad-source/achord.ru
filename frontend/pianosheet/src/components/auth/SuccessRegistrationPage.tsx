import { Page } from 'components/shared/layout/Page/Page';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SuccessRegistrationPage.module.scss';
import cn from 'classnames';
import { useAccountActivationMutation } from 'redux/api/userApi';
// import { ConfirmationType, confirmEmail } from 'redux/slices/!del_user';

type ConfirmationType = {
    isConfirmed: boolean;
    message?: string;
};

export const SuccessRegistrationPage = () => {
    const [confirmEmail] = useAccountActivationMutation();

    const { uid, token } = useParams<{ uid: string; token: string }>();
    const [confirm, setConfirm] = React.useState<ConfirmationType>({
        isConfirmed: false,
    });

    React.useEffect(() => {
        if (token && uid) {
            confirmEmail({ userId: uid, token })
                .unwrap()
                .then((confirm) => setConfirm(confirm));
        }
    }, []);

    return (
        <Page hideSheetsNav>
            {confirm.isConfirmed ? (
                <div className={cn(styles.confirmMessage, styles.confirmMessage_success)}>
                    <div>Почта успешно подтверждена!</div>
                    <div className={styles.confirmMessage__description}>
                        Перейти на <Link to="/">Главную страницу</Link>
                    </div>
                </div>
            ) : (
                <div className={cn(styles.confirmMessage, styles.confirmMessage_error)}>
                    <div>Почта не подтверждена!</div>
                    <div className={styles.confirmMessage__description}>{confirm.message}</div>
                </div>
            )}
        </Page>
    );
};
