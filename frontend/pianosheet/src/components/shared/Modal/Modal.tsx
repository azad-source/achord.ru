import * as React from 'react';
import { Loader } from '../layout/Loader/Loader';
import styles from './Modal.module.scss';
import cn from 'classnames';
import { isDarkTheme } from 'redux/slices/appSlice';
import { useAppSelector } from 'redux/hooks';

interface Props {
    title: string;
    children: React.ReactNode;
    isLoading?: boolean;
    bottomPanel?: React.ReactNode;
    setScroll?: boolean;
    className?: string;
    onClose: () => void;
}

export const Modal: React.FC<Props> = ({
    title,
    children,
    isLoading = false,
    bottomPanel,
    setScroll = false,
    className,
    onClose,
}) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            <div className={styles.overlay}></div>
            <div className={cn(styles.modal, setScroll && styles.modal_onScroll, className)}>
                <div className={styles.scrollWrapper}>
                    <div className={styles.modal_title}>
                        {title}
                        <div className={styles.modal_close} onClick={onClose} />
                    </div>
                    <Loader isLoading={isLoading}>{children}</Loader>
                    {!!bottomPanel && <div className={styles.modal_bottomPanel}>{bottomPanel}</div>}
                </div>
            </div>
        </div>
    );
};
