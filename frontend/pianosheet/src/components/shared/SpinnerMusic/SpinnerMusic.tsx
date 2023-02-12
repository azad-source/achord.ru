import * as React from 'react';
import styles from './SpinnerMusic.module.scss';
import cn from 'classnames';
import { isDarkTheme } from 'redux/slices/app';
import { useAppSelector } from 'redux/hooks';

interface Props {
    withBackground?: boolean;
}

export const SpinnerMusic: React.FC<Props> = ({ withBackground = false }) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div
            className={cn(
                styles.root,
                isDark && styles.root__dark,
                withBackground && styles.root_bg,
            )}
        >
            <span className={styles.loader}></span>
        </div>
    );
};
