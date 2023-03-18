import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './LetterPage.module.scss';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useGetAuthorsQuery } from 'redux/api/authorApi';
import authorsStyles from 'styles/authors.module.scss';

export const LetterPage = () => {
    const { letter = '' } = useParams<{ letter: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const title = `${SiteName} - ${letter.toUpperCase()}`;
    const { data: authors, isFetching } = useGetAuthorsQuery({ letter, page: pageNumber });

    React.useEffect(() => {
        document.title = title;
        setPageNumber(1);
    }, [letter, location]);

    React.useEffect(() => {
        window.scroll({ top: 0, behavior: 'smooth' });
    }, [pageNumber]);

    const breadcrumbs: BreadcrumbProps[] = [
        { caption: 'Ноты', link: Paths.sheetsPage },
        { caption: letter.toUpperCase() },
    ];

    return (
        <Page breadcrumbs={breadcrumbs} showAddAuthorBtn loading={isFetching}>
            <TextPlain className={styles.title}>{letter.toUpperCase()}</TextPlain>
            <div className={authorsStyles.authors}>
                {authors?.results.map((author, index) => (
                    <AuthorCard key={index} author={author} className={authorsStyles.authors__item} />
                ))}
            </div>
            {authors && authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={setPageNumber}
                />
            )}
            {authors && authors.count === 0 && !isFetching && (
                <TextPlain className={styles.empty}>Раздел пока пустой</TextPlain>
            )}
        </Page>
    );
};
