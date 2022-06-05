import { useAuth } from 'api/UsersClient';
import { Page } from 'components/shared/layout/Page/Page';
import { Tabs } from 'components/shared/Tabs/Tabs';
import { SiteName } from 'domain/SiteInfo';
import * as React from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { FavouriteAuthors } from './FavouriteAuthors/FavouriteAuthors';
import { RandomAuthors } from './RandomAuthors/RandomAuthors';
import { TopAuthors } from './TopAuthors/TopAuthors';

const MainPageFC = () => {
    const [tab, setTab] = React.useState<number>(0);
    const [logged] = useAuth();
    const location = useLocation();

    React.useEffect(() => {
        document.title = `${SiteName} - Главная`;
    }, [location]);

    const tabs: string[] = ['Случайная подборка', 'Популярное'];

    if (logged) {
        tabs.push('Избранное');
    }

    const handleChangeTab = (tabKey: number) => {
        setTab(tabKey);
    };

    return (
        <Page>
            <Tabs items={tabs} value={tab} onValueChange={handleChangeTab} />
            {tab === 0 ? <RandomAuthors /> : tab === 1 ? <TopAuthors /> : <FavouriteAuthors />}
        </Page>
    );
};

export const MainPage = withRouter(MainPageFC);
