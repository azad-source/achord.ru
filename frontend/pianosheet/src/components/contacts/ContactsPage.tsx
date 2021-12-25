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
import photo_bg from 'images/photo_bg.jpg';

export const ContactsPage = () => {
    React.useEffect(() => {
        document.title = `${SiteName} - Контакты`;
    }, []);

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

    const contact: React.FC<ContactProps> = ({
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
            <div className={styles.contact__avatar}>
                <div className={styles.bgBlur} style={{ backgroundImage: `url(${photo_bg})` }} />
                <img src={avatar} alt={name} className={styles.img} />
            </div>
            <div className={styles.contact__name}>{name}</div>
            <div className={styles.contact__role}>{role}</div>
            <div className={styles.contact__infos}>
                {!!email && (
                    <a className={styles.info} href={`mailto:${email}`} title="email">
                        <EmailIcon />
                    </a>
                )}
                {!!telegram && (
                    <a
                        className={styles.info}
                        href={`https://telegram.im/@${telegram}`}
                        target="_blank"
                        rel="noreferrer"
                        title="telegram"
                    >
                        <TelegramIcon />
                    </a>
                )}
                {!!whatsapp && (
                    <a
                        className={styles.info}
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        title="whatsapp"
                    >
                        <WhatsAppIcon />
                    </a>
                )}
                {!!facebook && (
                    <a
                        className={styles.info}
                        href={`https://www.facebook.com/${facebook}`}
                        target="_blank"
                        rel="noreferrer"
                        title="facebook"
                    >
                        <FacebookIcon />
                    </a>
                )}
                {!!vk && (
                    <a
                        className={styles.info}
                        href={`https://vk.com/${vk}`}
                        target="_blank"
                        rel="noreferrer"
                        title="vk"
                    >
                        <VkIcon />
                    </a>
                )}
                {!!instagram && (
                    <a
                        className={styles.info}
                        href={`http://instagram.com/_u/${instagram}/`}
                        target="_blank"
                        rel="noreferrer"
                        title="instagram"
                    >
                        <InstagramIcon />
                    </a>
                )}
            </div>
            {!!webPage && (
                <a className={styles.webPage} href={webPage} target="_blank" rel="noreferrer">
                    Личный сайт
                </a>
            )}
        </div>
    );

    return (
        <Page hideSheetsNav>
            <div className={styles.root}>
                <div></div>
                <div className={styles.contacts}>
                    {contact({
                        avatar: ava_chinzhin,
                        name: 'Дмитрий ЧИНЖИН',
                        role: 'back-end',
                        email: 'azad_63_mamedov@mail.ru',
                        telegram: 'azad_63_mamedov',
                        webPage: 'https://chinzhin.ru/',
                    })}
                    {contact({
                        avatar: ava_mamedov,
                        name: 'Азад МАМЕДОВ',
                        role: 'front-end',
                        email: 'azad_63_mamedov@mail.ru',
                        telegram: 'azad_63_mamedov',
                        facebook: 'azad.mamedov.338',
                        webPage: 'https://azad-source.github.io/CV/dist/',
                    })}
                </div>
            </div>
        </Page>
    );
};
