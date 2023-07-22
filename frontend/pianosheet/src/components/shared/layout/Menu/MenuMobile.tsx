import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './MenuMobile.module.scss';
import { Toggle } from 'components/shared/Toggle/Toggle';
import { SheetsNav } from '../SheetsNav/SheetsNav';
import { MenuItemType } from '../Header/Header';
import cn from 'classnames';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

interface Props {
    items: MenuItemType[];
}

export const MenuMobile: React.FC<Props> = ({ items }) => {
    const [menu, setMenu] = React.useState({
        main: { transform: 'translateY(-150%)' },
        burger: { transform: 'none' },
        overlay: { display: 'none' },
    });

    const location = useLocation();

    const isDark = useAppSelector(isDarkTheme);

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
            className={cn(styles.root, isDark && styles.root__dark)}
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
                        items.map(({ caption, link, handler }, idx) => {
                            if (link || handler) {
                                return (
                                    <NavLink
                                        key={`idx_${idx}`}
                                        className={styles.menuItem}
                                        to={link || ''}
                                        // exact
                                        onClick={handler}
                                    >
                                        {caption}
                                    </NavLink>
                                );
                            }

                            return (
                                <div key={`idx_${idx}`} className={styles.toggle}>
                                    {caption}
                                </div>
                            );
                        })}
                </div>
                <div className={styles.sheetNav}>
                    <Toggle
                        onChange={handleChangeNavLang}
                        position={navLang === 'en' ? 'right' : 'left'}
                        items={['EN', 'RU']}
                        isDark={isDark}
                        className={styles.navLanguageToggle}
                    />
                    <SheetsNav
                        isMenu
                        hideEn={navLang != 'en'}
                        hideRu={navLang != 'ru'}
                        isDark={isDark}
                    />
                </div>
            </div>
        </div>
    );
};
