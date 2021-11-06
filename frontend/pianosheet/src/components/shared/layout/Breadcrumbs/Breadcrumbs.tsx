import * as React from 'react';
import styles from './Breadcrumbs.module.scss';

interface Props {
    items: { caption: string; link?: string }[];
}

export const Breadcrumbs: React.FC<Props> = ({ items }) => {
    return (
        <div className={styles.root}>
            {items.length > 0 && (
                <div className={styles.items}>
                    <div className={styles.item}>
                        <a className={styles.link} href="/">
                            Главная
                        </a>
                    </div>
                    {items.map(({ caption, link }) => (
                        <div key={caption} className={styles.item}>
                            <span className={styles.separator}>/</span>
                            {link ? (
                                <a className={styles.link} href={link}>
                                    {caption}
                                </a>
                            ) : (
                                <span>{caption}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
