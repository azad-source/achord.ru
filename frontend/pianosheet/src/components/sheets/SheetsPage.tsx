import * as React from 'react';
import styles from './SheetsPage.scss';
import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';
import { Breadcrumbs } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';

export default function SheetsPage() {
    React.useEffect(() => {
        document.title = `${SiteName} - Ноты`;
    }, []);

    const breadcrumbs: { caption: string }[] = [
        {
            caption: 'Ноты',
        },
    ];

    return (
        <Page>
            <Breadcrumbs items={breadcrumbs} />
            Здесь будут ноты 
        </Page>
    );
}
