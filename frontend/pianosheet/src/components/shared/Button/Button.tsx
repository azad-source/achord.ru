import * as React from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';
import { MouseEvent } from 'react';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';

type ButtonUse = 'link' | 'default' | 'transparent';

interface Props {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    use?: ButtonUse;
    type?: 'button' | 'submit' | 'reset' | undefined;
    icon?: React.ReactNode;
    title?: string;
    size?: 'small' | 'middle' | 'large';
    onClick?: (e: MouseEvent) => void;
}

export const Button: React.FC<Props> = ({
    className,
    children,
    use = 'default',
    disabled,
    icon,
    title,
    size = 'middle',
    ...props
}) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <button
            disabled={disabled}
            className={cn(
                styles.root,
                styles[use],
                disabled && styles.disabled,
                styles[size],
                isDark && styles.root__dark,
                className,
            )}
            title={title}
            {...props}
        >
            {!!icon && <div className={styles.icon}>{icon}</div>}
            {children}
        </button>
    );
};
