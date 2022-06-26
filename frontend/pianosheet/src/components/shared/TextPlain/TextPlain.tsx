import * as React from 'react';
import styles from './TextPlain.module.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

interface Props {
    children: React.ReactNode;
    size?: 'small' | 'middle' | 'large';
    className?: string;
    style?: React.CSSProperties | undefined;
}

export const TextPlain: React.FC<Props> = ({ children, size = 'middle', style, className }) => {
    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

    return (
        <div
            className={cn(styles.root, styles[size], isDark && styles.root__dark, className)}
            style={style}
        >
            {children}
        </div>
    );
};
