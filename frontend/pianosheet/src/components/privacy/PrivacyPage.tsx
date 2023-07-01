import { Page } from 'components/shared/layout/Page/Page';
import { Privacy } from 'components/shared/Privacy/Privacy';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';

export const PrivacyPage = () => {
    React.useEffect(() => {
        document.title = `${SiteName} - Политика обработки персональных данных`;
    }, []);

    return (
        <Page hideSheetsNav>
            <Privacy />
        </Page>
    );
};
