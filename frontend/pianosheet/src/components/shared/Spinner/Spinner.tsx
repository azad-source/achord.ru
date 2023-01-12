import * as React from 'react';
import styles from './Spinner.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

interface Props {
    withBackground?: boolean;
}

export const Spinner: React.FC<Props> = ({ withBackground = false }) => {
    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

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
