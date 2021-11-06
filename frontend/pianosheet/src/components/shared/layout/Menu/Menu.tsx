import { LogoutIcon } from 'components/shared/icons/LogoutIcon';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import cn from 'classnames';

interface Props {
    items: { caption: string; link: string }[];
    logged: boolean;
    logout: () => void;
}

export const Menu: React.FC<Props> = ({ items, logged, logout }) => {
    return (
        <div className={styles.root}>
            {items.length > 0 &&
                items.map(({ caption, link }) => (
                    <NavLink
                        key={caption}
                        className={styles.menuItem}
                        to={link}
                        exact
                    >
                        {caption}
                    </NavLink>
                ))}

            <div className={cn(styles.menuItem, styles.menuItemSign)}>
                {logged ? (
                    <a
                        onClick={logout}
                        className={styles.logoutLink}
                        title="Log out"
                    >
                        <LogoutIcon />
                    </a>
                ) : (
                    <NavLink
                        to="/sign-in"
                        className={styles.menuItemSignLink}
                        exact
                    >
                        Вход
                    </NavLink>
                )}
            </div>
        </div>
    );
};
