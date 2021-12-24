import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItemType } from '../Header/Header';
import styles from './Menu.module.scss';

interface Props {
    items: MenuItemType[];
}

export const Menu: React.FC<Props> = ({ items }) => {
    return (
        <div className={styles.root}>
            {items.length > 0 &&
                items.map(({ caption, link, handler }) => (
                    <NavLink
                        key={caption}
                        className={styles.menuItem}
                        to={link || ''}
                        onClick={handler}
                        exact
                    >
                        {caption}
                    </NavLink>
                ))}
        </div>
    );
};
