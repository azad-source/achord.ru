import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import styles from './ContactsPage.scss';
import { EmailIcon } from 'components/shared/icons/EmailIcon';
import { TelegramIcon } from 'components/shared/icons/TelegramIcon';
import { WhatsAppIcon } from 'components/shared/icons/WhatsAppIcon';
import { FacebookIcon } from 'components/shared/icons/FacebookIcon';
import { VkIcon } from 'components/shared/icons/VkIcon';
import { InstagramIcon } from 'components/shared/icons/InstagramIcon';
import ava_chinzhin from 'images/chinzhin.png';
import ava_mamedov from 'images/mamedov.png';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { Link } from 'components/shared/Link/Link';

export const ContactsPage = () => {
    React.useEffect(() => {
        document.title = `${SiteName} - Контакты`;
    }, []);

    return (
        <Page hideSheetsNav>
            <TextPlain className={styles.title}>Добро пожаловать на сайт achord.ru !</TextPlain>
            <TextPlain className={styles.aboutUs}>
                <p>
                    Здесь вы найдете ноты известных отечественных и зарубежных композиторов, ноты на
                    музыку многих музыкальных групп и певцов, по различным направлениям и эпохам. На
                    сайте предоставлена удобная навигация для поиска и скачивания нот по названию
                    нот, имён авторов, по жанрам, а также можно увидеть топ популярных произведений
                    и авторов. Для авторизованных пользователей доступна возможность добавлять ноты
                    для имеющихся авторов.
                </p>
                <div className={styles.separator} />
                <p>
                    Проект Achord реализован и продолжает развиваться благодаря нашим усилиям. Мы
                    будем рады обратной связи от вас. Все предложения и идеи можете отправлять на
                    электронную почту сайта{' '}
                    <Link href="mailto:achord.ru@gmail.com">achord.ru@gmail.com</Link> или связаться
                    по указанным ниже контактам.
                </p>
            </TextPlain>
            <TextPlain className={styles.contacts}>
                {Contact({
                    avatar: ava_chinzhin,
                    name: 'Дмитрий ЧИНЖИН',
                    role: 'back-end разработчик',
                    email: 'chinzhin@mail.ru',
                    telegram: 'chinzhin',
                    webPage: 'chinzhin.ru',
                })}
                {Contact({
                    avatar: ava_mamedov,
                    name: 'Азад МАМЕДОВ',
                    role: 'front-end разработчик',
                    email: 'azad_63_mamedov@mail.ru',
                    telegram: 'azad_63_mamedov',
                    facebook: 'azad.mamedov.338',
                    // webPage: 'https://azad-source.github.io/CV/dist/',
                })}
            </TextPlain>
        </Page>
    );
};

interface ContactProps {
    avatar: string;
    name: string;
    role?: string;
    email?: string;
    telegram?: string;
    whatsapp?: string;
    facebook?: string;
    vk?: string;
    instagram?: string;
    webPage?: string;
}

const Contact: React.FC<ContactProps> = ({
    avatar,
    name,
    role,
    email,
    telegram,
    whatsapp,
    facebook,
    vk,
    instagram,
    webPage,
}) => (
    <div className={styles.contact}>
        <div className={styles.avatar}>
            <img src={avatar} alt={name} className={styles.img} />
        </div>
        <div className={styles.infos}>
            <TextPlain className={styles.infos__name}>{name}</TextPlain>
            <TextPlain className={styles.infos__role}>{role}</TextPlain>
            <div className={styles.infos__socials}>
                {!!email && (
                    <Link href={`mailto:${email}`} title="email">
                        <EmailIcon />
                    </Link>
                )}
                {!!telegram && (
                    <Link
                        href={`https://t.me/${telegram}`}
                        target="_blank"
                        rel="noreferrer"
                        title="telegram"
                    >
                        <TelegramIcon />
                    </Link>
                )}
                {!!whatsapp && (
                    <Link
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        title="whatsapp"
                    >
                        <WhatsAppIcon />
                    </Link>
                )}
                {!!facebook && (
                    <Link
                        href={`https://www.facebook.com/${facebook}`}
                        target="_blank"
                        rel="noreferrer"
                        title="facebook"
                    >
                        <FacebookIcon />
                    </Link>
                )}
                {!!vk && (
                    <Link href={`https://vk.com/${vk}`} target="_blank" rel="noreferrer" title="vk">
                        <VkIcon />
                    </Link>
                )}
                {!!instagram && (
                    <Link
                        href={`http://instagram.com/_u/${instagram}/`}
                        target="_blank"
                        rel="noreferrer"
                        title="instagram"
                    >
                        <InstagramIcon />
                    </Link>
                )}
            </div>
            {!!webPage && (
                <Link
                    href={`https://${webPage}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.webPage}
                >
                    {webPage}
                </Link>
            )}
        </div>
    </div>
);
