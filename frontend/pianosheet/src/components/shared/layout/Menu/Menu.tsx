import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItemType } from '../Header/Header';
import styles from './Menu.module.scss';
import cn from 'classnames';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

interface Props {
    items: MenuItemType[];
}

export const Menu: React.FC<Props> = ({ items }) => {
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            {items.length > 0 &&
                items.map(({ caption, link, handler }, idx) => {
                    if (link || handler) {
                        return (
                            <NavLink
                                key={`idx_${idx}`}
                                className={styles.menuItem}
                                to={link || ''}
                                onClick={handler}
                                // exact
                            >
                                {caption}
                            </NavLink>
                        );
                    }
                    return (
                        <div key={`idx_${idx}`} className={styles.menuItem}>
                            {caption}
                        </div>
                    );
                })}
        </div>
    );
};
