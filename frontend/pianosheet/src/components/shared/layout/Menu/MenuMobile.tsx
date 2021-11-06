import { LogoutIcon } from 'components/shared/icons/LogoutIcon';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MenuMobile.module.scss';
import cn from 'classnames';

interface Props {
    items: { caption: string; link: string }[];
    logged: boolean;
    logout: () => void;
}

export const MenuMobile: React.FC<Props> = ({ items, logged, logout }) => {
    const [menu, setMenu] = React.useState({
        main: { transform: 'translateY(-150%)' },
        burger: { transform: 'none' },
        overlay: { display: 'none' },
    });

    const openMenu = () => {
        setMenu({
            main: { transform: 'translateY(0)' },
            burger: { transform: 'translateY(-300%)' },
            overlay: { display: 'block' },
        });
    };

    const closeMenu = () => {
        setMenu({
            main: { transform: 'translateY(-150%)' },
            burger: { transform: 'none' },
            overlay: { display: 'none' },
        });
    };

    const logoutHandle = () => {
        logout();
        closeMenu();
    };

    return (
        <div className={styles.root}>
            <div className={styles.burgerMenu} onClick={openMenu} style={menu.burger}>
                <span className={styles.burgerMenu_line}></span>
                <span className={styles.burgerMenu_line}></span>
                <span className={styles.burgerMenu_line}></span>
            </div>
            <div className={styles.overlay} style={menu.overlay} onClick={closeMenu}></div>
            <div className={styles.menuWrapper} style={menu.main}>
                <div className={styles.closeMenu} onClick={closeMenu}></div>
                <div className={styles.menuitems}>
                    {items.length > 0 &&
                        items.map(({ caption, link }) => (
                            <NavLink
                                key={caption}
                                className={styles.menuItem}
                                to={link}
                                exact
                                onClick={closeMenu}
                            >
                                {caption}
                            </NavLink>
                        ))}

                    {logged ? (
                        <NavLink
                            onClick={logoutHandle}
                            className={cn(styles.menuItem, styles.logoutLink)}
                            title="Log out"
                            to={''}
                        >
                            <LogoutIcon /> Выйти
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/sign-in"
                            className={cn(styles.menuItem, styles.signLink)}
                            exact
                            onClick={closeMenu}
                        >
                            Вход
                        </NavLink>
                    )}
                </div>
            </div>
        </div>
    );
};
