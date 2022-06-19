import * as React from 'react';
import styles from './Link.module.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

interface Props
    extends React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    > {
    size?: 'xsmall' | 'small' | 'medium' | 'large';
}

export const Link: React.FC<Props> = ({ size = 'medium', ...props }) => {
    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            <a className={cn(styles.link, styles[size])} {...props}>
                {props.children}
            </a>
        </div>
    );
};
