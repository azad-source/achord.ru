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
import { SearchResults } from 'components/search/SearchResults';
import { useToast } from 'components/shared/Toast/Toast';
import { BreadcrumbProps, Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthorItemJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import { Paths } from 'utils/routes/Paths';
import { AuthorAddModal } from 'components/sheets/AuthorAddModal/AuthorAddModal';
import { ErrorBoundary } from 'components/shared/ErrorBoundary/ErrorBoundary';

interface Props {
    className?: string;
    status?: QueryStatus;
    localStatus?: QueryStatus;
    children: React.ReactNode;
    searchApplied: boolean;
    hideSheetsNav?: boolean;
    warning?: string;
    breadcrumbs?: BreadcrumbProps[];
    isSuperUser?: boolean;
    showAddAuthorBtn?: boolean;
    darkTheme?: boolean;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
}

const PageFC: React.FC<Props> = ({
    className,
    children,
    status = QueryStatus.initial(),
    localStatus = QueryStatus.initial(),
    searchApplied,
    hideSheetsNav = false,
    warning,
    breadcrumbs,
    isSuperUser = false,
    showAddAuthorBtn = false,
    darkTheme = false,
    addAuthor,
}) => {
    const [showAddAuthorModal, setShowAddAuthorModal] = React.useState<boolean>(false);
    const history = useHistory();

    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    let output: React.ReactNode = '';

    if (searchApplied) {
        output = <SearchResults />;
    } else {
        output = children;
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
            <ErrorBoundary>
                {!hideSheetsNav && <SheetsNav />}
                <div className={cn(styles.root, className)}>
                    {!!breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                    {isSuperUser && showAddAuthorBtn && !searchApplied && (
                        <div
                            onClick={openAddAuthorModal}
                            className={styles.addAuthor}
                            title="Добавить автора"
                        />
                    )}
                    {status.isRequest() ? <Spinner /> : output}
                    {localStatus.isRequest() && <Spinner withBackground />}
                </div>
                {toast}
                {showAddAuthorModal && (
                    <AuthorAddModal closeModal={closeAddAuthorModal} addAuthor={addAuthorHandler} />
                )}
            </ErrorBoundary>
        </div>
    );
};

type OwnProps = Pick<Props, 'className' | 'children' | 'status' | 'darkTheme'>;

const mapStateToProps = (
    { sheets: { search, localStatus, warning }, users: { currentUser } }: RootState,
    { className, children, status, darkTheme }: OwnProps,
) => ({
    className,
    localStatus: localStatus,
    status,
    children,
    darkTheme,
    searchApplied: search.applied,
    warning: warning,
    isSuperUser: currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            addAuthor: sheetsAction.addAuthor,
        },
        dispatch,
    );
};

export const Page = connect(mapStateToProps, mapDispatchToProps)(PageFC);
