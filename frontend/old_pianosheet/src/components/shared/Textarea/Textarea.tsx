import * as React from 'react';
import styles from './Textarea.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

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
    minLength?: number;
    width?: number | string;
}

export const Textarea: React.FC<Props> = ({ className, width, ...props }) => {
    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');
    const rootStyles = { width };

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)} style={rootStyles}>
            <textarea className={cn(styles.textarea, className)} {...props}></textarea>
        </div>
    );
};
