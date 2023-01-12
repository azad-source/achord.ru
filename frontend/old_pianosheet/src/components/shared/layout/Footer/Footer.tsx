import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import styles from './Footer.module.scss';
import cn from 'classnames';
import { Button } from 'components/shared/Button/Button';
import { useHistory } from 'react-router-dom';

interface Props {
    isDark?: boolean;
}

export const Footer: React.FC<Props> = ({ isDark = false }) => {
    const year = new Date().getFullYear();

    const history = useHistory();

    return (
        <footer className={cn(styles.backplate, isDark && styles.backplate__dark)}>
            <div className={styles.root}>
                <div className={styles.item}>
                    <Button onClick={() => history.push('/')} use="link">
                        Главная
                    </Button>
                </div>
                <div className={styles.item}>
                    <Button onClick={() => history.push('/privacy')} use="link">
                        Политика конфиденциальности
                    </Button>
                </div>
                <div className={cn(styles.item, styles.copyright)}>
                    <TextPlain>
                        Copyright © {SiteName} {year}
                    </TextPlain>
                </div>
                <div className={styles.item}>
                    <Button onClick={() => history.push('/contacts')} use="link">
                        Контактная информация
                    </Button>
                </div>
                <div className={styles.item}>
                    <Button onClick={() => history.push('/copyright-holders')} use="link">
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
