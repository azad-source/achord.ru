import { Page } from 'components/shared/layout/Page/Page';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SuccessRegistrationPage.module.scss';
import cn from 'classnames';
import { bindActionCreators, Dispatch } from 'redux';
import { ConfirmationType, usersAction } from 'store/usersActions';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { QueryStatus } from 'domain/QueryStatus';

interface Props {
    status: QueryStatus;
    className?: string;
    confirmEmail: (uid: string, token: string) => Promise<ConfirmationType>;
}

const SuccessRegistrationPageFC: React.FC<Props> = ({
    status,
    className,
    confirmEmail,
}) => {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const [confirm, setConfirm] = React.useState<ConfirmationType>({
        isConfirmed: false,
    });

    React.useEffect(() => {
        confirmEmail(uid, token).then((confirm) => setConfirm(confirm));
    }, []);

    return (
        <Page hideSheetsNav>
            {confirm.isConfirmed ? (
                <div
                    className={cn(
                        styles.confirmMessage,
                        styles.confirmMessage_success,
                    )}
                >
                    <div>Почта успешно подтверждена!</div>
                    <div className={styles.confirmMessage__description}>
                        Перейти на <Link to="/">Главную страницу</Link>
                    </div>
                </div>
            ) : (
                <div
                    className={cn(
                        styles.confirmMessage,
                        styles.confirmMessage_error,
                    )}
                >
                    <div>Почта не подтверждена!</div>
                    <div className={styles.confirmMessage__description}>
                        {confirm.message}
                    </div>
                </div>
            )}
        </Page>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        status: state.users.status,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            confirmEmail: usersAction.confirmEmail,
        },
        dispatch,
    );
};

export const SuccessRegistrationPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SuccessRegistrationPageFC);
