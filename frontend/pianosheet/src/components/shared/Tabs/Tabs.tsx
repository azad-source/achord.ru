import * as React from 'react';
import styles from './Tabs.module.scss';
import cn from 'classnames';
import { isDarkTheme } from 'redux/slices/app';
import { useAppSelector } from 'redux/hooks';

interface Props {
    items: string[];
    value: number;
    className?: string;
    onValueChange: (key: number) => void;
}

export const Tabs: React.FC<Props> = ({ items, value, className, onValueChange }) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark, className)}>
            <div className={styles.tabs}>
                {items.map((caption, index) => (
                    <div
                        key={caption}
                        className={cn(
                            styles.tabs__item,
                            index === value && styles.tabs__item_active,
                        )}
                        onClick={() => onValueChange(index)}
                    >
                        {caption}
                    </div>
                ))}
            </div>
            <div className={styles.baseline} />
        </div>
    );
};
