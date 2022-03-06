import * as React from 'react';
import styles from './Tabs.module.scss';
import cn from 'classnames';

interface Props {
    items: string[];
    value: number;
    className?: string;
    onValueChange: (key: number) => void;
}

export const Tabs: React.FC<Props> = ({ items, value, className, onValueChange }) => {
    return (
        <div className={cn(styles.root, className)}>
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
