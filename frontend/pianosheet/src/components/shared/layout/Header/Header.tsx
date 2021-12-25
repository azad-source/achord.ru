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
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { usersAction } from 'store/usersActions';

interface Props {
    getUser: () => void;
}

export type MenuItemType = { caption: string; link?: string; handler?: () => void };

const HeaderFC: React.FC<Props> = ({ getUser }) => {
    const [logged] = useAuth();

    const location = useLocation();

    React.useEffect(() => {
        document.title = SiteName;
        getUser();
    }, [location]);

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
            caption: 'О нас',
            link: Paths.contactsPage,
        },
        {
            caption: logged ? 'Выйти' : 'Войти',
            link: !logged ? '/sign-in' : undefined,
            handler: logged ? logout : undefined,
        },
        // {
        //     caption: 'Piano',
        //     link: Paths.virtPianoPage,
        // },
    ];

    return (
        <header className={styles.backplate}>
            <div className={styles.root}>
                <NavLink className={styles.logo} to="/">
                    <div className={styles.logoIcon}>
                        <Logo className={styles.svg} />
                    </div>
                </NavLink>
                <SearchField className={styles.search} />
                <Menu items={menuItems} />
                <MenuMobile items={menuItems} />
            </div>
        </header>
    );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getUser: usersAction.getCurrentUser,
        },
        dispatch,
    );
};

export const Header = connect(null, mapDispatchToProps)(HeaderFC);
