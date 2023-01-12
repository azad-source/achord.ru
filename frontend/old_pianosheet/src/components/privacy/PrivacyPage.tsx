import { Page } from 'components/shared/layout/Page/Page';
import { Privacy } from 'components/shared/Privacy/Privacy';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

const PrivacyPageFC = () => {
    React.useEffect(() => {
        document.title = `${SiteName} - Политика обработки персональных данных`;
    }, []);

    return (
        <Page hideSheetsNav>
            <Privacy />
        </Page>
    );
};

export const PrivacyPage = withRouter(PrivacyPageFC);
