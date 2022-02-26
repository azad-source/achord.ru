import * as React from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';
import { MouseEvent } from 'react';

type ButtonUse = 'link' | 'default' | 'transparent';

interface Props {
    className?: string;
    disabled?: boolean;
    use?: ButtonUse;
    type?: 'button' | 'submit' | 'reset' | undefined;
    icon?: React.ReactNode;
    title?: string;
    onClick?: (e: MouseEvent) => void;
}

export const Button: React.FC<Props> = ({
    className,
    children,
    use = 'default',
    disabled,
    icon,
    title,
    ...props
}) => {
    return (
        <button
            disabled={disabled}
            className={cn(styles.root, styles[use], disabled && styles.disabled, className)}
            title={title}
            {...props}
        >
            {!!icon && <div className={styles.icon}>{icon}</div>}
            {children}
        </button>
    );
};
