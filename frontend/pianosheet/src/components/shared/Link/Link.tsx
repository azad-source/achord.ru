import * as React from 'react';
import styles from './Link.module.scss';
import cn from 'classnames';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

interface Props
    extends React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    > {
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    className?: string;
}

export const Link: React.FC<Props> = ({ size = 'medium', className, ...props }) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark, className)}>
            <a className={cn(styles.link, styles[size])} {...props}>
                {props.children}
            </a>
        </div>
    );
};
