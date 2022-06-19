import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useLocation, useParams } from 'react-router-dom';
import styles from './LetterPage.scss';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useAuth } from 'api/UsersClient';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';

interface Props {
    authors: AuthorJsModel;
    status: QueryStatus;
    isSuperUser?: boolean;
    getAuthors: (letter?: string, page?: number) => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
    addAuthorToFavorite: (authorId: number, isFavorite: boolean) => void;
}

const LetterPageFC: React.FC<Props> = ({
    authors,
    status,
    isSuperUser = false,
    getAuthors,
    editAuthor,
    removeAuthor,
    addAuthorToFavorite,
}) => {
    const { letter } = useParams<{ letter: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const title = `${SiteName} - ${letter.toUpperCase()}`;
    const [logged] = useAuth();

    React.useEffect(() => {
        document.title = title;
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
        <Page breadcrumbs={breadcrumbs} showAddAuthorBtn status={status}>
            <TextPlain className={styles.title}>{letter.toUpperCase()}</TextPlain>
            <div className={styles.authors}>
                {authors.results.map((author, index) => (
                    <AuthorCard
                        key={index}
                        author={author}
                        className={styles.authors_item}
                        editAuthor={isSuperUser ? editAuthor : undefined}
                        removeAuthor={isSuperUser ? removeAuthor : undefined}
                        addAuthorToFavorite={logged ? addAuthorToFavorite : undefined}
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
                <div className={styles.empty}>Раздел пока пустой</div>
            )}
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
            editAuthor: sheetsAction.editAuthor,
            removeAuthor: sheetsAction.removeAuthor,
            addAuthorToFavorite: sheetsAction.addAuthorToFavorite,
        },
        dispatch,
    );
};

export const LetterPage = connect(mapStateToProps, mapDispatchToProps)(LetterPageFC);
