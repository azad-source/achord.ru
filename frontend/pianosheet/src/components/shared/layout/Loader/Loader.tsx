import * as React from 'react';
import cn from 'classnames';
import styles from './Loader.module.scss';
import { QueryStatus } from 'domain/QueryStatus';
import { Spinner } from 'components/shared/Spinner/Spinner';

interface Props {
    className?: string;
    loadStatus?: QueryStatus;
    children: React.ReactNode;
}

export const Loader: React.FC<Props> = ({
    className,
    children,
    loadStatus = QueryStatus.success(),
}) => {
    return (
        <div className={cn(styles.root, className)}>
            {children}

            {loadStatus.isRequest() && (
                <div className={styles.overlay}>
                    <Spinner />
                </div>
            )}
        </div>
    );
};
