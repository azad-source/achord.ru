import * as React from 'react';
import styles from './Link.module.scss';
import cn from 'classnames';

interface Props
    extends React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    > {
    size?: 'xsmall' | 'small' | 'medium' | 'large';
}

export const Link: React.FC<Props> = ({ size = 'medium', ...props }) => {
    return (
        <div className={styles.root}>
            <a className={cn(styles.link, styles[size])} {...props}>
                {props.children}
            </a>
        </div>
    );
};
