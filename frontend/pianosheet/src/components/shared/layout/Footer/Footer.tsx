import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import styles from './Footer.module.scss';
import cn from 'classnames';
import { Button } from 'components/shared/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

export const Footer = () => {
    const isDark = useAppSelector(isDarkTheme);
    const year = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <footer className={cn(styles.backplate, isDark && styles.backplate__dark)}>
            <div className={styles.root}>
                <div className={styles.item}>
                    <Button onClick={() => navigate('/')} use="link">
                        Главная
                    </Button>
                </div>
                <div className={styles.item}>
                    <Button onClick={() => navigate('/privacy')} use="link">
                        Политика конфиденциальности
                    </Button>
                </div>
                <div className={cn(styles.item, styles.copyright)}>
                    <TextPlain>
                        Copyright © {SiteName} {year}
                    </TextPlain>
                </div>
                <div className={styles.item}>
                    <Button onClick={() => navigate('/contacts')} use="link">
                        Контактная информация
                    </Button>
                </div>
                <div className={styles.item}>
                    <Button onClick={() => navigate('/copyright-holders')} use="link">
                        Правовая информация
                    </Button>
                </div>
                <div className={styles.item}>
                    <Button
                        onClick={() => window.open('https://vk.com/piano_music_sheet', '_blank')}
                        use="link"
                    >
                        Сообщество VK
                    </Button>
                </div>
            </div>
        </footer>
    );
};
