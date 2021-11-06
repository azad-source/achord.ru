import { QueryStatus } from 'domain/QueryStatus';
import * as React from 'react';
import { Loader } from '../layout/Loader/Loader';
import { Spinner } from '../Spinner/Spinner';
import styles from './Modal.scss';

interface Props {
    title: string;
    loadStatus?: QueryStatus;
    onClose: () => void;
}

export const Modal: React.FC<Props> = ({
    title,
    children,
    loadStatus = QueryStatus.success(),
    onClose,
}) => {
    return (
        <div className={styles.root}>
            <div className={styles.overlay}></div>
            <div className={styles.modal}>
                <div className={styles.modalClose} onClick={onClose} />
                <div className={styles.modalTitle}>{title}</div>
                <Loader loadStatus={loadStatus}>{children}</Loader>
            </div>
        </div>
    );
};
