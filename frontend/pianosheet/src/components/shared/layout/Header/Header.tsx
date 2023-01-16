import React from 'react';
import styles from './Header.module.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from 'components/shared/icons/Logo';
import { logout, useAuth } from 'redux/api/UserClient';
import { SearchField } from 'components/shared/layout/SearchField/SearchField';
import { SiteName } from 'domain/SiteInfo';
import { Menu } from 'components/shared/layout/Menu/Menu';
import { Paths } from 'utils/routes/Paths';
import { SwitchThemeToggle } from 'components/shared/SwitchThemeToggle/SwitchThemeToggle';
import cn from 'classnames';
import { MenuMobile } from 'components/shared/layout/Menu/MenuMobile';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme, switchTheme } from 'redux/slices/app';
import { clearCurrentUser, getCurrentUser } from 'redux/slices/user';

export type MenuItemType = { caption: React.ReactNode; link?: string; handler?: () => void };

export const Header = () => {
    const [logged] = useAuth();

    const location = useLocation();

    const dispatch = useAppDispatch();

    const isDark = useAppSelector(isDarkTheme);

    const themeTogglerHandler = () => {
        dispatch(switchTheme(isDark ? 'light' : 'dark'));
    };

    React.useEffect(() => {
        document.title = SiteName;
        dispatch(getCurrentUser(logged));
    }, [location]);

    const logoutHandler = () => {
        logout();
        dispatch(clearCurrentUser());
        window.location.pathname = '/sign-in';
    };

    const menuItems: MenuItemType[] = [
        {
            caption: 'Главная',
            link: Paths.mainPage,
        },
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: logged ? 'Выйти' : 'Войти',
            link: !logged ? '/sign-in' : undefined,
            handler: logged ? logoutHandler : undefined,
        },
        {
            caption: (
                <SwitchThemeToggle
                    className={styles.switchTheme}
                    isDark={isDark}
                    themeToggler={themeTogglerHandler}
                />
            ),
        },
    ];

    return (
        <header className={cn(styles.backplate, isDark && styles.backplate__dark)}>
            <div className={styles.root}>
                <NavLink className={styles.logo} to="/">
                    <div className={styles.logoIcon}>
                        <Logo className={styles.svg} />
                    </div>
                </NavLink>
                <SearchField className={styles.search} isDark={isDark} />
                <Menu items={menuItems} isDark={isDark} />
                <MenuMobile items={menuItems} isDark={isDark} />
            </div>
        </header>
    );
};
