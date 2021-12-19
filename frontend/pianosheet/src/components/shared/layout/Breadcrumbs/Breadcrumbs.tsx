import * as React from 'react';
import { useHistory } from 'react-router';
import styles from './Breadcrumbs.module.scss';
import cn from 'classnames';

export interface BreadcrumbProps {
    caption: string;
    link?: string;
}

interface Props {
    items: BreadcrumbProps[];
}

export const Breadcrumbs: React.FC<Props> = ({ items }) => {
    const history = useHistory();

    const goToPage = (link?: string) => {
        if (link) history.push(link);
    };

    return (
        <div className={styles.root}>
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
