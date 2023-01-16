import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './LetterPage.scss';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useAuth } from 'redux/api/UserClient';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { addAuthorToFavorite, editAuthor, getAuthors, removeAuthor } from 'redux/slices/author';

export const LetterPage = () => {
    const dispatch = useAppDispatch();
    const { author, user } = useAppSelector((state) => state);
    const { list: authors, status } = author;
    const isSuperUser = user.currentUser.is_superuser;

    const { letter = '' } = useParams<{ letter: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const title = `${SiteName} - ${letter.toUpperCase()}`;
    const [logged] = useAuth();

    React.useEffect(() => {
        document.title = title;
        dispatch(getAuthors({ letter }));
        setPageNumber(1);
    }, [letter, location]);

    const getAuthorsByPage = (page: number) => {
        dispatch(getAuthors({ letter, page }));
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: letter.toUpperCase(),
        },
    ];

    const editAuthorHandler = (authorId: number, author: FormData) => {
        return dispatch(editAuthor({ authorId, author })).unwrap();
    };

    const removeAuthorHandler = (authorId: number) => {
        return dispatch(removeAuthor(authorId)).unwrap();
    };

    const addAuthorToFavHandler = (authorId: number, isFavorite: boolean) => {
        return dispatch(addAuthorToFavorite({ authorId, isFavorite })).unwrap();
    };

    return (
        <Page breadcrumbs={breadcrumbs} showAddAuthorBtn loading={status.isRequest()}>
            <TextPlain className={styles.title}>{letter.toUpperCase()}</TextPlain>
            <div className={styles.authors}>
                {authors.results.map((author, index) => (
                    <AuthorCard
                        key={index}
                        author={author}
                        className={styles.authors_item}
                        editAuthor={isSuperUser ? editAuthorHandler : undefined}
                        removeAuthor={isSuperUser ? removeAuthorHandler : undefined}
                        addAuthorToFavorite={logged ? addAuthorToFavHandler : undefined}
                    />
                ))}
            </div>
            {authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={getAuthorsByPage}
                />
            )}
            {authors.count === 0 && !status.isRequest() && (
                <TextPlain className={styles.empty}>Раздел пока пустой</TextPlain>
            )}
        </Page>
    );
};
