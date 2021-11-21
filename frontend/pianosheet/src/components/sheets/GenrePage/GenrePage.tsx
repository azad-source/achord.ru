import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './GenrePage.scss';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction, sheetsActionTypes } from 'store/sheetsActions';
import { AuthorItemJsModel, AuthorJsModel, GenreItemJsModel } from 'domain/api/JsModels';
import { AuthorItems } from '../AuthorItems/AuthorItems';
import { QueryStatus } from 'domain/QueryStatus';
import { SiteName } from 'domain/SiteInfo';
import { Breadcrumbs } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';

interface Props {
    genre: GenreItemJsModel;
    authors: AuthorJsModel;
    status: QueryStatus;
    getGenreByAlias: (genreAlias: string) => void;
    getAuthorsByGenreAlias: (genreAlias: string, page?: number) => void;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
}

const GenrePageFC: React.FC<Props> = ({
    genre,
    authors,
    status,
    getGenreByAlias,
    getAuthorsByGenreAlias,
    addAuthor,
}) => {
    const { genreAlias } = useParams<{ genreAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();

    React.useEffect(() => {
        getGenreByAlias(genreAlias);
    }, []);

    React.useEffect(() => {
        if (genre) document.title = `${SiteName} - ${genre.name}`;
    }, [genre]);

    React.useEffect(() => {
        getAuthorsByGenreAlias(genreAlias);
        setPageNumber(1);
    }, [genreAlias, location]);

    const getAuthorsByPage = (page: number) => {
        getAuthorsByGenreAlias(genreAlias, page);
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    const breadcrumbs: { caption: string; link?: string }[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: genre.name.toUpperCase(),
        },
    ];

    return (
        <Page loadStatus={status}>
            <Breadcrumbs items={breadcrumbs} />
            <div className={styles.root}>
                <div className={styles.title}>{genre.name.toUpperCase()}</div>
                <AuthorItems
                    authors={authors}
                    addAuthor={addAuthor}
                    getAuthorsByPage={getAuthorsByPage}
                    pageNumber={pageNumber}
                />
            </div>
        </Page>
    );
};

const mapStateToProps = (state: RootState) => ({
    genre: state.sheets.genre,
    authors: state.sheets.authors,
    status: state.sheets.status,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getGenreByAlias: sheetsAction.getGenreByAlias,
            getAuthorsByGenreAlias: sheetsAction.getAuthorsByGenreAlias,
            addAuthor: sheetsAction.addAuthor,
        },
        dispatch,
    );
};

export const GenrePage = connect(mapStateToProps, mapDispatchToProps)(GenrePageFC);
