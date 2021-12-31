import * as React from 'react';
import cn from 'classnames';
import styles from './Page.scss';
import { QueryStatus } from 'domain/QueryStatus';
import { Spinner } from 'components/shared/Spinner/Spinner';
import { RootState } from 'store/rootReducer';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { SheetsNav } from '../SheetsNav/SheetsNav';
import { SearchApiResults } from 'store/sheetsReducer';
import { SearchResults } from 'components/search/SearchResults';
import { useToast } from 'components/shared/Toast/Toast';
import { BreadcrumbProps, Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { useHistory } from 'react-router-dom';
import { AuthorItemJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import { Paths } from 'utils/routes/Paths';
import { AuthorAddModal } from 'components/sheets/AuthorAddModal/AuthorAddModal';
import { SEO, SiteMetaType } from 'components/shared/seo/SEO';

interface Props {
    className?: string;
    loadStatus?: QueryStatus;
    children: React.ReactNode;
    search: SearchApiResults;
    hideSheetsNav?: boolean;
    warning?: string;
    breadcrumbs?: BreadcrumbProps[];
    isSuperUser?: boolean;
    showAddAuthorBtn?: boolean;
    darkTheme?: boolean;
    meta?: SiteMetaType;
    dropSearch: () => void;
    searchSheets: (query: string, page: number) => void;
    searchAuthors: (query: string, page: number) => void;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
}

const PageFC: React.FC<Props> = ({
    className,
    children,
    loadStatus = QueryStatus.success(),
    search,
    hideSheetsNav = false,
    warning,
    breadcrumbs,
    isSuperUser = false,
    showAddAuthorBtn = false,
    darkTheme = false,
    meta,
    dropSearch,
    searchSheets,
    searchAuthors,
    addAuthor,
}) => {
    const [showContent, setShowContent] = React.useState<boolean>(false);
    const [showAddAuthorModal, setShowAddAuthorModal] = React.useState<boolean>(false);
    const history = useHistory();

    React.useEffect(() => {
        setTimeout(() => {
            setShowContent(true);
        }, 200);
    }, []);

    let output: React.ReactNode = '';

    if (search.applied) {
        output = (
            <SearchResults
                search={search}
                skipSearch={dropSearch}
                searchSheets={searchSheets}
                searchAuthors={searchAuthors}
            />
        );
    } else {
        output = loadStatus.isRequest() ? <Spinner /> : children;
    }

    const { toast, push } = useToast();

    React.useEffect(() => {
        if (warning) push(warning);
    }, [warning]);

    const closeAddAuthorModal = () => setShowAddAuthorModal(false);
    const openAddAuthorModal = () => setShowAddAuthorModal(true);

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
        closeAddAuthorModal();
    };

    return (
        <div className={cn(styles.backplate, darkTheme && styles.root_dark)}>
            <SEO meta={meta} />
            {!hideSheetsNav && <SheetsNav />}
            <div className={cn(styles.root, className)}>
                {!!breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                {isSuperUser && showAddAuthorBtn && !search.applied && (
                    <div
                        onClick={openAddAuthorModal}
                        className={styles.addAuthor}
                        title="Добавить автора"
                    />
                )}
                {showContent ? output : <Spinner />}
            </div>
            {toast}
            {showAddAuthorModal && (
                <AuthorAddModal closeModal={closeAddAuthorModal} addAuthor={addAuthorHandler} />
            )}
        </div>
    );
};

type OwnProps = Pick<Props, 'className' | 'loadStatus' | 'children'>;

const mapStateToProps = (
    { sheets, users: { currentUser } }: RootState,
    { className, loadStatus, children }: OwnProps,
) => ({
    className,
    loadStatus,
    children,
    search: sheets.search,
    warning: sheets.warning,
    isSuperUser: currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            dropSearch: sheetsAction.dropSearch,
            searchSheets: sheetsAction.searchSheetsByPage,
            searchAuthors: sheetsAction.searchAuthorsByPage,
            addAuthor: sheetsAction.addAuthor,
        },
        dispatch,
    );
};

export const Page = connect(mapStateToProps, mapDispatchToProps)(PageFC);
