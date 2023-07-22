import { Button } from 'components/shared/Button/Button';
import { SadSmile } from 'components/shared/icons/SadSmile';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../Page/Page';
import styles from './NotFoundPage.module.scss';

interface Props {
    className?: string;
}

export const NotFoundPage: React.FC<Props> = ({ className }) => {
    const navigate = useNavigate();

    return (
        <Page className={styles.root}>
            <SadSmile className={styles.sadSmile} />
            <div className={styles.error}>
                <div className={styles.errorMessage}>Запрашиваемая страница не существует</div>
                <div className={styles.errorCode}>404</div>

                <Button onClick={() => navigate('/')} className={styles.button}>
                    На главную
                </Button>
            </div>
        </Page>
    );
};
