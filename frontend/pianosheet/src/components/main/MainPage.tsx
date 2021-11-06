import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import styles from './MainPage.scss';
import { TopAuthors } from './TopAuthors/TopAuthors';

const MainPage = () => {
    React.useEffect(() => {
        document.title = `${SiteName} - Главная`;
    }, []);
    
    return (
        <Page>
            <div className={styles.root}>
                <TopAuthors />
            </div>
        </Page>
    );
};

export default withRouter(MainPage);
