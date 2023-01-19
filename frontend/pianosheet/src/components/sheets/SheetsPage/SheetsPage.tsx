import * as React from 'react';
import styles from './SheetsPage.module.scss';
import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Link, useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';
import { getGenres } from 'redux/slices/genre';

export const SheetsPage = () => {
    const dispatch = useAppDispatch();
    const { genre } = useAppSelector((state) => state);
    const { status, list } = genre;

    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const title = `${SiteName} - Ноты`;

    const isDark = useAppSelector(isDarkTheme);

    React.useEffect(() => {
        document.title = title;
        dispatch(getGenres());
    }, [location]);

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
        },
    ];

    const getGenresByPage = (page: number) => {
        dispatch(getGenres(page));
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    return (
        <Page breadcrumbs={breadcrumbs} showAddAuthorBtn loading={status.isRequest()}>
            <div className={cn(styles.root, isDark && styles.root__dark)}>
                {list.results.map(({ id, name, alias, preview }) => (
                    <Link key={id} className={styles.item} to={Paths.getGenrePage(alias)}>
                        <div
                            className={styles.preview}
                            style={{ backgroundImage: `url(${preview})` }}
                        />
                        <TextPlain
                            style={{
                                fontSize: 22 / Math.pow(name.length, 0.25),
                            }}
                            className={styles.name}
                        >
                            {name}
                        </TextPlain>
                    </Link>
                ))}
            </div>
            {list.page_count > 1 && (
                <Pagination
                    pageCount={list.page_count}
                    pageNumber={pageNumber}
                    switchPage={getGenresByPage}
                />
            )}
        </Page>
    );
};
