import { LogoutIcon } from 'components/shared/icons/LogoutIcon';
import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './MenuMobile.module.scss';
import cn from 'classnames';
import { Toggle } from 'components/shared/Toggle/Toggle';
import { SheetsNav } from '../SheetsNav/SheetsNav';

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

    const location = useLocation();

    React.useEffect(() => {
        closeMenu();
    }, [location]);

    const [navLang, setNavLang] = React.useState<'ru' | 'en'>('en');

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

    const handleChangeNavLang = () => {
        setNavLang((prev) => (prev === 'en' ? 'ru' : 'en'));
    };

    const swipeMenu = {
        start: { x: 0, y: 0 },
        dist: { x: 0, y: 0, xMax: 100, yMin: -100 },
        time: { start: 0, elapsed: 0, allowed: 500 },
    };

    const handleMenuTouchStart = (e: React.TouchEvent) => {
        const { start, time } = swipeMenu;
        const touchObj = e.changedTouches[0];
        start.x = touchObj.pageX;
        start.y = touchObj.pageY;
        time.start = new Date().getTime();
    };

    const handleMenuTouchEnd = (e: React.TouchEvent) => {
        const { start, dist, time } = swipeMenu;
        const touchObj = e.changedTouches[0];
        dist.x = touchObj.pageX - start.x;
        dist.y = touchObj.pageY - start.y;
        time.elapsed = new Date().getTime() - time.start;

        if (time.elapsed <= time.allowed && Math.abs(dist.x) <= dist.xMax && dist.y < dist.yMin) {
            closeMenu();
        }
    };

    return (
        <div
            className={styles.root}
            onTouchStart={handleMenuTouchStart}
            onTouchEnd={handleMenuTouchEnd}
        >
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
                <div className={styles.sheetNav}>
                    <Toggle
                        onChange={handleChangeNavLang}
                        position={navLang === 'en' ? 'right' : 'left'}
                        items={['EN', 'RU']}
                    />
                    <SheetsNav isMenu hideEn={navLang != 'en'} hideRu={navLang != 'ru'} />
                </div>
            </div>
        </div>
    );
};
