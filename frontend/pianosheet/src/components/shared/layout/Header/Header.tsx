import React from 'react';
import styles from './Header.module.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from 'components/shared/icons/Logo';
import { logout, useAuth } from 'api/UsersClient';
import { SearchField } from 'components/shared/layout/SearchField/SearchField';
import { SiteName } from 'domain/SiteInfo';
import { Menu } from 'components/shared/layout/Menu/Menu';
import { MenuMobile } from '../Menu/MenuMobile';
import { Paths } from 'utils/routes/Paths';

export const Header = () => {
    const [logged] = useAuth();

    const location = useLocation();

    React.useEffect(() => {
        document.title = SiteName;
    }, [location]);

    const menuItems: { caption: string; link: string }[] = [
        {
            caption: 'Главная',
            link: Paths.mainPage,
        },
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: 'Piano',
            link: Paths.virtPianoPage,
        },
    ];

    const logoutHandler = () => {
        logout();
        window.location.href = '/sign-in';
    };

    return (
        <header className={styles.root}>
            <NavLink className={styles.logo} to="/">
                <div className={styles.logoIcon}>
                    <Logo className={styles.svg} />
                </div>
            </NavLink>
            <SearchField className={styles.search} />
            <Menu items={menuItems} logged={logged} logout={logoutHandler} />
            <MenuMobile
                items={menuItems}
                logged={logged}
                logout={logoutHandler}
            />
        </header>
    );
};
