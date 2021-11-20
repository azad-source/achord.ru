import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './GenrePage.scss';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import { AuthorItems } from '../AuthorItems/AuthorItems';
import { QueryStatus } from 'domain/QueryStatus';
import { SiteName } from 'domain/SiteInfo';
import { Breadcrumbs } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';

interface Props {
    authors: AuthorJsModel;
    status: QueryStatus;
    getAuthors: (genreAlias: string) => void;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
}

const GenrePageFC: React.FC<Props> = ({
    authors,
    status,
    getAuthors,
    addAuthor,
    editAuthor,
    removeAuthor,
}) => {
    const { genreAlias } = useParams<{ genreAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();

    React.useEffect(() => {
        document.title = `${SiteName} - ${genreAlias}`;
    }, []);

    React.useEffect(() => {
        getAuthors(genreAlias);
        setPageNumber(1);
    }, [genreAlias, location]);

    const getAuthorsByPage = (page: number) => {
        getAuthors(genreAlias);
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    const breadcrumbs: { caption: string; link?: string }[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: genreAlias.toUpperCase(),
        },
    ];

    return (
        <Page loadStatus={status}>
            <Breadcrumbs items={breadcrumbs} />
            <div className={styles.root}>
                <div className={styles.title}>{genreAlias.toUpperCase()}</div>
                <AuthorItems
                    authors={authors}
                    addAuthor={addAuthor}
                    getAuthorsByPage={getAuthorsByPage}
                    editAuthor={editAuthor}
                    pageNumber={pageNumber}
                    removeAuthor={removeAuthor}
                />
            </div>
        </Page>
    );
};

const mapStateToProps = (state: RootState) => ({
    authors: state.sheets.authors,
    status: state.sheets.status,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getAuthors: sheetsAction.getAuthorsByGenreAlias,
            addAuthor: sheetsAction.addAuthor,
            editAuthor: sheetsAction.editAuthor,
            removeAuthor: sheetsAction.removeAuthor,
        },
        dispatch,
    );
};

export const GenrePage = connect(mapStateToProps, mapDispatchToProps)(GenrePageFC);
