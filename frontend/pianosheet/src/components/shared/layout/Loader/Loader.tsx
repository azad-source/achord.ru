import * as React from 'react';
import cn from 'classnames';
import styles from './Loader.module.scss';
import { QueryStatus } from 'domain/QueryStatus';
import { Spinner, SpinnerType } from 'components/shared/Spinner/Spinner';

interface OwnProps {
    className?: string;
    loadStatus?: QueryStatus;
    children: React.ReactNode;
    spinnerType?: SpinnerType;
}

type Props = OwnProps &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Loader: React.FC<Props> = ({
    className,
    children,
    loadStatus = QueryStatus.success(),
    spinnerType,
    ...props
}) => {
    return (
        <div className={cn(styles.root, className)} {...props}>
            {children}
            {loadStatus.isRequest() && (
                <div className={styles.overlay}>
                    <Spinner type={spinnerType} />
                </div>
            )}
        </div>
    );
};
