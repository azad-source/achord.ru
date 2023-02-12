import * as React from 'react';
import styles from './SpinnerGrid.module.scss';
import cn from 'classnames';
import { isDarkTheme } from 'redux/slices/app';
import { useAppSelector } from 'redux/hooks';

interface Props {
    withBackground?: boolean;
}

export const SpinnerGrid: React.FC<Props> = ({ withBackground = false }) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div
            className={cn(
                styles.root,
                isDark && styles.root__dark,
                withBackground && styles.root_bg,
            )}
        >
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
};
