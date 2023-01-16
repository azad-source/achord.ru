import { Page } from 'components/shared/layout/Page/Page';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SuccessRegistrationPage.module.scss';
import cn from 'classnames';
import { useAppDispatch } from 'redux/hooks';
import { ConfirmationType, confirmEmail } from 'redux/slices/user';

export const SuccessRegistrationPage = () => {
    const dispatch = useAppDispatch();

    const { uid, token } = useParams<{ uid: string; token: string }>();
    const [confirm, setConfirm] = React.useState<ConfirmationType>({
        isConfirmed: false,
    });

    React.useEffect(() => {
        dispatch(confirmEmail({ userId: uid || '', token: token || '' }))
            .unwrap()
            .then((confirm) => setConfirm(confirm));
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
