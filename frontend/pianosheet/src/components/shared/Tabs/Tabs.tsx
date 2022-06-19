import * as React from 'react';
import styles from './Tabs.module.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';

interface Props {
    items: string[];
    value: number;
    className?: string;
    onValueChange: (key: number) => void;
}

export const Tabs: React.FC<Props> = ({ items, value, className, onValueChange }) => {
    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

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
