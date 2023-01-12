import * as React from 'react';
import styles from './Toggle.module.scss';
import cn from 'classnames';

interface Props {
    position: 'left' | 'right';
    items: string[];
    isDark?: boolean;
    className?: string;
    onChange: () => void;
}

export const Toggle: React.FC<Props> = ({
    position,
    items,
    isDark = false,
    className,
    onChange,
}) => {
    return (
        <div className={cn(styles.root, isDark && styles.root__dark, className)} onClick={onChange}>
            <div className={styles[`root_${position}`]}></div>
            <div className={styles.root__right}>{items[0]}</div>
            <div className={styles.root__checkbox}></div>
            <div className={styles.root__left}>{items[1]}</div>
        </div>
    );
};
