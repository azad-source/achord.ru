import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './LetterPage.scss';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorJsModel } from 'domain/api/JsModels';
import { AuthorItems } from '../AuthorItems/AuthorItems';
import { QueryStatus } from 'domain/QueryStatus';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';

interface Props {
    authors: AuthorJsModel;
    status: QueryStatus;
    getAuthors: (letter?: string, page?: number) => void;
}

const LetterPageFC: React.FC<Props> = ({ authors, status, getAuthors }) => {
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

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: letter.toUpperCase(),
        },
    ];

    return (
        <Page loadStatus={status} breadcrumbs={breadcrumbs} showAddAuthorBtn>
            <div className={styles.root}>
                <div className={styles.title}>{letter.toUpperCase()}</div>
                <AuthorItems
                    authors={authors}
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
    isSuperUser: state.users.currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getAuthors: sheetsAction.getAuthors,
        },
        dispatch,
    );
};

export const LetterPage = connect(mapStateToProps, mapDispatchToProps)(LetterPageFC);
