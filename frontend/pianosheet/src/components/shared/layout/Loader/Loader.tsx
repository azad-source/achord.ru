import * as React from 'react';
import cn from 'classnames';
import styles from './Loader.module.scss';
import { Spinner, SpinnerType } from 'components/shared/Spinner/Spinner';

interface OwnProps {
    className?: string;
    isLoading?: boolean;
    children: React.ReactNode;
    spinnerType?: SpinnerType;
}

type Props = OwnProps &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Loader: React.FC<Props> = ({
    className,
    children,
    isLoading = false,
    spinnerType,
    ...props
}) => {
    return (
        <div className={cn(styles.root, className)} {...props}>
            {children}
            {isLoading && (
                <div className={styles.overlay}>
                    <Spinner type={spinnerType} />
                </div>
            )}
        </div>
    );
};
