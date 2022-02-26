import * as React from 'react';
import styles from './Spinner.scss';
import cn from 'classnames';

interface Props {
    withBackground?: boolean;
}

export const Spinner: React.FC<Props> = ({ withBackground = false }) => (
    <div className={cn(styles.root, withBackground && styles.root_bg)}>
        <div className={styles.ldsGrid}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
);
