import * as React from 'react';
import styles from './Input.module.scss';
import cn from 'classnames';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';

interface Props {
    value?: string;
    type?:
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week';
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    placeholder?: string;
    id?: string;
    className?: string;
    autoFocus?: boolean;
    accept?: string;
    size?: number;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    icon?: React.ReactNode;
    width?: number | string;
    checked?: boolean;
}

export const Input: React.FC<Props> = ({
    id,
    className,
    type = 'text',
    required,
    icon,
    width,
    checked,
    onClick,
    ...props
}) => {
    const rootStyles = { width };
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)} style={rootStyles}>
            <span className={cn(required && styles.required)} title="Это поле обязательное" />
            <input
                type={type}
                required={required}
                id={id}
                className={cn(styles.input, className, styles[type])}
                checked={checked}
                {...props}
            />
            <div onClick={onClick}>{icon}</div>
        </div>
    );
};
