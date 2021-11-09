import * as React from 'react';
import styles from './Input.module.scss';
import cn from 'classnames';

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
    className?: string;
    autoFocus?: boolean;
    accept?: string;
    size?: number;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    icon?: React.ReactNode;
    width?: number | string;
}

export const Input: React.FC<Props> = ({
    className,
    type = 'text',
    required,
    icon,
    width,
    onClick,
    ...props
}) => {
    const rootStyles = { width };

    return (
        <div className={styles.root} style={rootStyles}>
            <span className={cn(required && styles.required)} title="Это поле обязательное" />
            <input
                type={type}
                required={required}
                className={cn(styles.input, className, styles[type])}
                {...props}
            />
            <div onClick={onClick}>{icon}</div>
        </div>
    );
};
