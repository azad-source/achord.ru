import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import styles from './Footer.module.scss';

interface Props {
    className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
    const year = new Date().getFullYear();
    return (
        <div className={styles.root}>
            <div className={styles.copyright}>
                Copyright © {SiteName} {year}
            </div>
        </div>
    );
};
