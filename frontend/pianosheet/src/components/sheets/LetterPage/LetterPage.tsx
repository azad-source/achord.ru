import * as React from 'react';
import { Page } from 'components/shared/layout/Page/Page';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styles from './LetterPage.scss';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorItemJsModel, AuthorJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import { AuthorItems } from '../AuthorItems/AuthorItems';
import { QueryStatus } from 'domain/QueryStatus';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import { AuthorCardAdd } from 'components/shared/AuthorCard/AuthorCard';
import { AuthorAddModal } from '../AuthorAddModal/AuthorAddModal';

interface Props {
    authors: AuthorJsModel;
    status: QueryStatus;
    isSuperUser?: boolean;
    getAuthors: (letter?: string, page?: number) => void;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
}

const LetterPageFC: React.FC<Props> = ({
    authors,
    status,
    isSuperUser = false,
    getAuthors,
    addAuthor,
}) => {
    const { letter } = useParams<{ letter: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const history = useHistory();

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

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const addAuthorHandler = (options: AuthorRequestModel) => {
        let formData = new FormData();
        formData.append('preview', options.preview);
        formData.append('name', options.name);
        formData.append('info', options.info);
        formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
        addAuthor(formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.name.charAt(0), res.alias));
            }
        });
        closeModal();
    };

    return (
        <Page loadStatus={status} breadcrumbs={breadcrumbs}>
            <div className={styles.root}>
                <div>
                    <div className={styles.title}>{letter.toUpperCase()}</div>
                    {isSuperUser && <AuthorCardAdd onClick={openModal} />}
                </div>
                <AuthorItems
                    authors={authors}
                    getAuthorsByPage={getAuthorsByPage}
                    pageNumber={pageNumber}
                />
            </div>
            {showModal && <AuthorAddModal closeModal={closeModal} addAuthor={addAuthorHandler} />}
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
            addAuthor: sheetsAction.addAuthor,
        },
        dispatch,
    );
};

export const LetterPage = connect(mapStateToProps, mapDispatchToProps)(LetterPageFC);
