import * as React from 'react';
import { useNavigate } from 'react-router';
import styles from './Breadcrumbs.module.scss';
import cn from 'classnames';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

export interface BreadcrumbProps {
    caption: string;
    link?: string;
}

interface Props {
    items: BreadcrumbProps[];
}

export const Breadcrumbs: React.FC<Props> = ({ items }) => {
    const navigate = useNavigate();

    const isDark = useAppSelector(isDarkTheme);

    const goToPage = (link?: string) => {
        if (link) navigate(link);
    };

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            {items.length > 0 && (
                <div className={styles.items}>
                    <div className={styles.item} onClick={() => goToPage('/')}>
                        Главная
                    </div>

                    {items.map(({ caption, link }) => (
                        <div key={caption}>
                            <span className={styles.separator}>/</span>
                            <span
                                className={cn(!!link && styles.item)}
                                onClick={() => goToPage(link)}
                            >
                                {caption}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
