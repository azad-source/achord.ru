import React from 'react';
import styles from './Header.module.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from 'components/shared/icons/Logo';
import { SearchField } from 'components/shared/layout/SearchField/SearchField';
import { SiteName } from 'domain/SiteInfo';
import { Menu } from 'components/shared/layout/Menu/Menu';
import { Paths } from 'utils/routes/Paths';
import { SwitchThemeToggle } from 'components/shared/SwitchThemeToggle/SwitchThemeToggle';
import cn from 'classnames';
import { MenuMobile } from 'components/shared/layout/Menu/MenuMobile';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';
import {
    useLazySearchAuthorsQuery,
    useLazySearchSheetsQuery,
    useLazyGetUserDataQuery,
    api,
} from 'redux/api';
import { addSearch, dropSearch } from 'redux/slices/searchSlice';
import { logout, useAuth } from 'redux/apiConfig';

export type MenuItemType = { caption: React.ReactNode; link?: string; handler?: () => void };

export const Header = () => {
    const [searchAuthors, { isSuccess: isSearchAuthorsSuccess }] = useLazySearchAuthorsQuery();
    const [searchSheets, { isSuccess: isSearchSheetsSuccess }] = useLazySearchSheetsQuery();
    const [getCurrentUser, { data: currentUser }] = useLazyGetUserDataQuery();

    const [searchQuery, setSearchQuery] = React.useState<string>('');

    const isSuccess = isSearchAuthorsSuccess && isSearchSheetsSuccess;

    const [logged] = useAuth();

    const location = useLocation();

    const dispatch = useAppDispatch();

    const isDark = useAppSelector(isDarkTheme);

    React.useEffect(() => {
        document.title = SiteName;
        if (logged && !currentUser?.id) {
            getCurrentUser();
        }
    }, [location]);

    const logoutHandler = () => {
        logout();
        dispatch(api.util.invalidateTags(['User']));
        window.location.pathname = '/sign-in';
    };

    const handleSearch = (query: string) => {
        Promise.all([searchAuthors({ query }), searchSheets({ query })])
            .then(() => {
                dispatch(addSearch({ query, applied: true }));
            })
            .finally(() => {
                setSearchQuery(query);
            });
    };

    const handleDropSearch = () => dispatch(dropSearch());

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
            caption: <SwitchThemeToggle className={styles.switchTheme} />,
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
                <SearchField
                    query={searchQuery}
                    onSearch={handleSearch}
                    onDropSearch={handleDropSearch}
                    isSuccess={isSuccess}
                    className={styles.search}
                    isDark={isDark}
                />
                <Menu items={menuItems} isDark={isDark} />
                <MenuMobile items={menuItems} isDark={isDark} />
            </div>
        </header>
    );
};
