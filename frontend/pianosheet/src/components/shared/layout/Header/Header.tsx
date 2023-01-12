import React from 'react';
import styles from './Header.module.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from 'components/shared/icons/Logo';
import { logout, useAuth } from 'api/UsersClient';
import { SearchField } from 'components/shared/layout/SearchField/SearchField';
import { SiteName } from 'domain/SiteInfo';
import { Menu } from 'components/shared/layout/Menu/Menu';
import { Paths } from 'utils/routes/Paths';
import { useDispatch, useSelector } from 'react-redux';
import { usersAction } from 'store/usersActions';
import { SwitchThemeToggle } from 'components/shared/SwitchThemeToggle/SwitchThemeToggle';
import cn from 'classnames';
import { RootState } from 'store/rootReducer';
import { appAction } from 'store/appActions';
import { MenuMobile } from '../Menu/MenuMobile';

export type MenuItemType = { caption: React.ReactNode; link?: string; handler?: () => void };

export const Header = () => {
    const [logged] = useAuth();

    const location = useLocation();

    const dispatch = useDispatch();

    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

    const themeTogglerHandler = () => {
        dispatch(appAction.switchTheme(isDark ? 'light' : 'dark'));
    };

    React.useEffect(() => {
        document.title = SiteName;
        dispatch(usersAction.getCurrentUser(logged));
    }, [location]);

    const logoutHandler = () => {
        logout();
        dispatch(usersAction.clearCurrentUser());
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
