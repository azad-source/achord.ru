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

export const ContactsPage = () => {
    React.useEffect(() => {
        document.title = `${SiteName} - Контакты`;
    }, []);

    interface ContactProps {
        avatar: string;
        name: string;
        email?: string;
        telegram?: string;
        whatsapp?: string;
        facebook?: string;
        vk?: string;
        instagram?: string;
    }

    const contact: React.FC<ContactProps> = ({
        avatar,
        name,
        email,
        telegram,
        whatsapp,
        facebook,
        vk,
        instagram,
    }) => (
        <div className={styles.contact}>
            <div className={styles.contact__avatar}>
                <img src={avatar} alt={name} className={styles.img} />
            </div>
            <div className={styles.contact__name}>{name}</div>
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
        </div>
    );

    return (
        <Page hideSheetsNav darkTheme>
            {/* <Breadcrumbs items={breadcrumbs} /> */}
            <div className={styles.root}>
                <div></div>
                <div className={styles.contacts}>
                    {/* {contact({
                        avatar: 'https://sun9-33.userapi.com/impg/1IArdR81t5a_Ije1haqJyu6cgsaEHain-PbyFQ/aKtpiD91AxM.jpg?size=806x1080&quality=95&sign=b908a75ed2c29550745a992866e2998f&type=album',
                        name: 'Дмитрий ЧИНЖИН',
                        email: 'azad_63_mamedov@mail.ru',
                        telegram: 'azad_63_mamedov',
                        whatsapp: '89276951562',
                        vk: 'azad_m',
                        facebook: 'azad.mamedov.338',
                        instagram: 'azad63mamedov',
                    })}
                    {contact({
                        avatar: 'https://sun9-33.userapi.com/impg/1IArdR81t5a_Ije1haqJyu6cgsaEHain-PbyFQ/aKtpiD91AxM.jpg?size=806x1080&quality=95&sign=b908a75ed2c29550745a992866e2998f&type=album',
                        name: 'Азад МАМЕДОВ',
                        email: 'azad_63_mamedov@mail.ru',
                        telegram: 'azad_63_mamedov',
                        whatsapp: '89276951562',
                        vk: 'azad_m',
                        facebook: 'azad.mamedov.338',
                        instagram: 'azad63mamedov',
                    })} */}
                </div>
            </div>
        </Page>
    );
};
