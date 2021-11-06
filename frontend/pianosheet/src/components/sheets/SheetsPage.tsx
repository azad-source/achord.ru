import * as React from 'react';
import styles from './SheetsPage.scss';
import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';

export default function SheetsPage() {
    React.useEffect(() => {
        document.title = `${SiteName} - Ноты`;
    }, []);
    
    return (
        <Page>
            <div className={styles.root}></div>
        </Page>
    );
}
