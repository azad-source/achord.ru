import { QueryStatus } from 'domain/QueryStatus';
import * as React from 'react';
import { Loader } from '../layout/Loader/Loader';
import styles from './Modal.scss';

interface Props {
    title: string;
    loadStatus?: QueryStatus;
    bottomPanel?: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<Props> = ({
    title,
    children,
    loadStatus = QueryStatus.success(),
    bottomPanel,
    onClose,
}) => {
    return (
        <div className={styles.root}>
            <div className={styles.overlay}></div>
            <div className={styles.modal}>
                <div className={styles.scrollWrapper}>
                    <div className={styles.modal_title}>
                        {title}
                        <div className={styles.modal_close} onClick={onClose} />
                    </div>
                    <Loader loadStatus={loadStatus}>{children}</Loader>
                    {!!bottomPanel && <div className={styles.modal_bottomPanel}>{bottomPanel}</div>}
                </div>
            </div>
        </div>
    );
};
