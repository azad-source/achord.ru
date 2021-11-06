import * as React from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';
import { MouseEvent } from 'react';

type ButtonUse = 'link' | 'default' | 'transparent';

interface Props {
    className?: string;
    disabled?: boolean;
    onClick?: (e: MouseEvent) => void;
    use?: ButtonUse;
    type?: 'button' | 'submit' | 'reset' | undefined;
}

export const Button: React.FC<Props> = ({
    className,
    children,
    use = 'default',
    disabled,
    ...props
}) => {
    return (
        <button
            disabled={disabled}
            className={cn(
                styles.root,
                styles[use],
                disabled && styles.disabled,
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
};
