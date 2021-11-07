import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './LetterPage.scss';
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
    getAuthors: (letter?: string, page?: number) => void;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
}

const LetterPageFC: React.FC<Props> = ({ authors, status, getAuthors, addAuthor }) => {
    const { letter } = useParams<{ letter: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();

    React.useEffect(() => {
        document.title = `${SiteName} - ${letter.toUpperCase()}`;
    }, []);

    React.useEffect(() => {
        getAuthors(letter);
        setPageNumber(1);
    }, [letter, location]);

    const getAuthorsByPage = (page: number) => {
        getAuthors(letter, page);
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    const breadcrumbs: { caption: string; link?: string }[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetPage,
        },
        {
            caption: letter.toUpperCase(),
        },
    ];

    return (
        <Page loadStatus={status}>
            <Breadcrumbs items={breadcrumbs} />
            <div className={styles.root}>
                <h1>{letter.toUpperCase()}</h1>
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
    authors: state.sheets.authors,
    status: state.sheets.status,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getAuthors: sheetsAction.getAuthors,
            addAuthor: sheetsAction.addAuthor,
        },
        dispatch,
    );
};

export const LetterPage = connect(mapStateToProps, mapDispatchToProps)(LetterPageFC);
