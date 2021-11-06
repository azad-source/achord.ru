import * as React from 'react';
import styles from './Textarea.scss';
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
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    cols?: number;
    rows?: number;
    maxLength?: number;
    minLength?:number;
}

export const Textarea: React.FC<Props> = ({ className, ...props }) => {
    return <textarea className={cn(styles.root, className)} {...props}></textarea>;
};
