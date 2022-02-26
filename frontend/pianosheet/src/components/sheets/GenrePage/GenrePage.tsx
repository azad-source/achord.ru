import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './GenrePage.scss';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorItemJsModel, AuthorJsModel, GenreItemJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';

interface Props {
    genre: GenreItemJsModel;
    authors: AuthorJsModel;
    status: QueryStatus;
    isSuperUser?: boolean;
    getGenreByAlias: (genreAlias: string) => void;
    getAuthorsByGenreAlias: (genreAlias: string, page?: number) => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
    addAuthorToFavorite: (authorId: number, isFavorite: boolean) => void;
}

const GenrePageFC: React.FC<Props> = ({
    genre,
    authors,
    status,
    isSuperUser = false,
    getGenreByAlias,
    getAuthorsByGenreAlias,
    editAuthor,
    removeAuthor,
    addAuthorToFavorite,
}) => {
    const { genreAlias } = useParams<{ genreAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();

    React.useEffect(() => {
        getGenreByAlias(genreAlias);
    }, []);

    React.useEffect(() => {
        if (genre) {
            const title = `${SiteName} - ${genre.name}`;
            document.title = title;
        }
    }, [genre]);

    React.useEffect(() => {
        getAuthorsByGenreAlias(genreAlias);
        setPageNumber(1);
    }, [genre, location]);

    const getAuthorsByPage = (page: number) => {
        getAuthorsByGenreAlias(genreAlias, page);
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: genre.name.toUpperCase(),
        },
    ];

    return (
        <Page loadStatus={status} breadcrumbs={breadcrumbs} showAddAuthorBtn>
            <div className={styles.root}>
                <div className={styles.title}>{genre.name.toUpperCase()}</div>
                <div className={styles.authors}>
                    {authors.results.map((author, index) => (
                        <AuthorCard
                            key={index}
                            author={author}
                            className={styles.authors_item}
                            isSuperUser={isSuperUser}
                            editAuthor={editAuthor}
                            removeAuthor={removeAuthor}
                            addAuthorToFavorite={addAuthorToFavorite}
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
            </div>
        </Page>
    );
};

const mapStateToProps = (state: RootState) => ({
    genre: state.sheets.genre,
    authors: state.sheets.authors,
    status: state.sheets.status,
    isSuperUser: state.users.currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getGenreByAlias: sheetsAction.getGenreByAlias,
            getAuthorsByGenreAlias: sheetsAction.getAuthorsByGenreAlias,
            editAuthor: sheetsAction.editAuthor,
            removeAuthor: sheetsAction.removeAuthor,
            addAuthorToFavorite: sheetsAction.addAuthorToFavorite,
        },
        dispatch,
    );
};

export const GenrePage = connect(mapStateToProps, mapDispatchToProps)(GenrePageFC);
