import { QueryStatus } from 'domain/QueryStatus';
import * as React from 'react';
import { Loader } from '../layout/Loader/Loader';
import styles from './Modal.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

interface Props {
    title: string;
    loadStatus?: QueryStatus;
    bottomPanel?: React.ReactNode;
    setScroll?: boolean;
    className?: string;
    onClose: () => void;
}

export const Modal: React.FC<Props> = ({
    title,
    children,
    loadStatus = QueryStatus.success(),
    bottomPanel,
    setScroll = false,
    className,
    onClose,
}) => {
    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            <div className={styles.overlay}></div>
            <div className={cn(styles.modal, setScroll && styles.modal_onScroll, className)}>
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
