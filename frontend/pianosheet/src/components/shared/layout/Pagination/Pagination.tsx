import * as React from 'react';
import styles from './Pagination.scss';
import cn from 'classnames';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';

interface Props {
    className?: string;
    pageCount: number;
    pageNumber: number;
    size?: 'big' | 'small';
    switchPage: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({
    className,
    pageCount,
    pageNumber,
    size = 'big',
    switchPage,
}) => {
    let items: number[] = [];

    const isDark = useAppSelector(isDarkTheme);

    for (let i = 1; i <= pageCount; i++) {
        items.push(i);
    }

    const handleSwitchPage = (page: number) => {
        if (page !== pageNumber && page <= pageCount && page >= 1) {
            switchPage(page);
        }
    };

    return (
        <div className={cn(styles.root, styles[size], isDark && styles.root__dark, className)}>
            <div
                className={cn(styles.item, pageNumber === 1 && styles.currentItem)}
                onClick={() => handleSwitchPage(pageNumber - 1)}
            >
                &larr;
            </div>

            {items.map((item) => (
                <div
                    key={item}
                    className={cn(styles.item, item === pageNumber && styles.currentItem)}
                    onClick={() => handleSwitchPage(item)}
                >
                    {item}
                </div>
            ))}

            <div
                className={cn(styles.item, pageNumber === pageCount && styles.currentItem)}
                onClick={() => handleSwitchPage(pageNumber + 1)}
            >
                &rarr;
            </div>
        </div>
    );
};
