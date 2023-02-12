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
import { useAuth } from 'redux/api/UserClient';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getGenreByAlias } from 'redux/slices/genre';
import {
    addAuthorToFavorite,
    editAuthor,
    getAuthorsByGenreAlias,
    removeAuthor,
} from 'redux/slices/author';
import { AuthorItemJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';

export const GenrePage = () => {
    const dispatch = useAppDispatch();
    const { genre, author, user } = useAppSelector((state) => state);
    const { current: currentGenre, status: genreStatus } = genre;
    const {
        list: authors,
        status: authorStatus,
        currentStatus: currentAuthorStatus,
        current,
    } = author;
    const isSuperUser = user.currentUser.is_superuser;

    const { genreAlias } = useParams<{ genreAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const [logged] = useAuth();

    React.useEffect(() => {
        if (genreAlias) {
            dispatch(getGenreByAlias(genreAlias));
        }
    }, []);

    React.useEffect(() => {
        if (currentGenre) {
            const title = `${SiteName} - ${currentGenre.name}`;
            document.title = title;
        }
    }, [currentGenre]);

    React.useEffect(() => {
        if (genreAlias) {
            dispatch(getAuthorsByGenreAlias({ genreAlias }));
            setPageNumber(1);
        }
    }, [currentGenre, location]);

    const getAuthorsByPage = (page: number) => {
        if (genreAlias) {
            dispatch(getAuthorsByGenreAlias({ genreAlias, page }));
            setPageNumber(page);
            window.scroll({ top: 0, behavior: 'smooth' });
        }
    };

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: currentGenre?.name.toUpperCase() || '',
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

    const getCardStatus = (author: AuthorItemJsModel): QueryStatus => {
        if (author.id === current?.id) {
            return currentAuthorStatus;
        }
        return QueryStatus.initial();
    };

    return (
        <Page
            breadcrumbs={breadcrumbs}
            showAddAuthorBtn
            loading={genreStatus.isRequest() || authorStatus.isRequest()}
        >
            <TextPlain className={styles.title}>{currentGenre?.name.toUpperCase()}</TextPlain>
            <div className={styles.authors}>
                {authors.results.map((author, index) => (
                    <AuthorCard
                        key={index}
                        author={author}
                        className={styles.authors_item}
                        editAuthor={isSuperUser ? editAuthorHandler : undefined}
                        removeAuthor={isSuperUser ? removeAuthorHandler : undefined}
                        addAuthorToFavorite={logged ? addAuthorToFavHandler : undefined}
                        status={getCardStatus(author)}
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
            {authors.count === 0 && !authorStatus.isRequest() && !genreStatus.isRequest() && (
                <TextPlain className={styles.empty}>Раздел пока пустой</TextPlain>
            )}
        </Page>
    );
};
