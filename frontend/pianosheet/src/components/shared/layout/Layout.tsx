import * as React from 'react';
import styles from './Layout.module.scss';

interface Props {
    children?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => (
    <div className={styles.root}>
        <div className={styles.content}>
            {children}
        </div>
    </div>
);

export default Layout;
