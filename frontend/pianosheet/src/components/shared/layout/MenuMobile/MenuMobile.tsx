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
    const [menuStyles, setMenuStyles] = React.useState({
        transform: 'translateX(-150%)',
    });
    const [burgerBtnStyles, setBurgerBtnStyles] = React.useState({
        transform: 'none',
    });
    const [overlayBtnStyles, setOverlayStyles] = React.useState({
        display: 'none',
    });

    const openMenu = () => {
        setMenuStyles({
            transform: 'translateX(0)',
        });
        setBurgerBtnStyles({ transform: 'translateY(-300%)' });
        setOverlayStyles({ display: 'block' });
    };
    const closeMenu = () => {
        setMenuStyles({
            transform: 'translateX(-150%)',
        });
        setBurgerBtnStyles({ transform: 'none' });
        setOverlayStyles({ display: 'none' });
    };

    const logoutHandle = () => {
        logout();
        closeMenu();
    };

    return (
        <div className={styles.root}>
            <div
                className={styles.burgerMenu}
                onClick={openMenu}
                style={burgerBtnStyles}
            >
                <span className={styles.burgerMenu_line}></span>
                <span className={styles.burgerMenu_line}></span>
                <span className={styles.burgerMenu_line}></span>
            </div>
            <div
                className={styles.overlay}
                style={overlayBtnStyles}
                onClick={closeMenu}
            ></div>
            <div className={styles.menuWrapper} style={menuStyles}>
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
