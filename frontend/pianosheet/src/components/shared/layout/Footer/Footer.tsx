import { Link } from 'components/shared/Link/Link';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import styles from './Footer.module.scss';
import cn from 'classnames';

export const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className={styles.backplate}>
            <div className={styles.root}>
                <div className={styles.item}>
                    <Link className={styles.link} href="/">
                        Главная
                    </Link>
                </div>
                <div className={styles.item}>
                    <Link className={styles.link} href="/privacy">
                        Политика конфиденциальности
                    </Link>
                </div>
                <div className={cn(styles.item, styles.copyright)}>
                    Copyright © {SiteName} {year}
                </div>
                <div className={styles.item}>
                    <Link className={styles.link} href="/contacts">
                        Контактная информация
                    </Link>
                </div>
                <div className={styles.item}>
                    <Link className={styles.link} href="/copyright-holders">
                        Правовая информация
                    </Link>
                </div>
                <div className={styles.item}>
                    <Link
                        className={styles.link}
                        href="https://vk.com/piano_music_sheet"
                        target="_blank"
                    >
                        Сообщество VK
                    </Link>
                </div>
            </div>
        </footer>
    );
};
