import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './GenrePage.module.scss';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useLazyGetAuthorsByGenreAliasQuery, useLazyGetGenreByAliasQuery } from 'redux/api';
import authorsStyles from 'styles/authors.module.scss';

export const GenrePage = () => {
    const [getAuthors, { data: authors, isFetching: isAuthorsLoading }] =
        useLazyGetAuthorsByGenreAliasQuery({});
    const [getGenreByAlias, { data: genre, isFetching: isGenreLoading }] =
        useLazyGetGenreByAliasQuery();

    const { genreAlias } = useParams<{ genreAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();

    React.useEffect(() => {
        if (genreAlias) {
            getGenreByAlias({ alias: genreAlias });
        }
    }, []);

    React.useEffect(() => {
        if (genre) {
            const title = `${SiteName} - ${genre.name}`;
            document.title = title;
        }
    }, [genre]);

    React.useEffect(() => {
        if (genreAlias) {
            getAuthors({ genreAlias });
            setPageNumber(1);
        }
    }, [genre, location]);

    const getAuthorsByPage = (page: number) => {
        if (genreAlias) {
            getAuthors({ genreAlias, page });
            setPageNumber(page);
            window.scroll({ top: 0, behavior: 'smooth' });
        }
    };

    const breadcrumbs: BreadcrumbProps[] = [
        { caption: 'Ноты', link: Paths.sheetsPage },
        { caption: genre?.name.toUpperCase() || '' },
    ];

    return (
        <Page
            breadcrumbs={breadcrumbs}
            showAddAuthorBtn
            loading={isGenreLoading || isAuthorsLoading}
        >
            <TextPlain className={styles.title}>{genre?.name.toUpperCase()}</TextPlain>
            <div className={authorsStyles.authors}>
                {authors?.results.map((author, index) => (
                    <AuthorCard
                        key={index}
                        author={author}
                        className={authorsStyles.authors__item}
                    />
                ))}
            </div>
            {authors && authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={getAuthorsByPage}
                />
            )}
            {authors && authors.count === 0 && !isAuthorsLoading && !isGenreLoading && (
                <TextPlain className={styles.empty}>Раздел пока пустой</TextPlain>
            )}
        </Page>
    );
};
