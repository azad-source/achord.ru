import * as React from 'react';
import cn from 'classnames';
import styles from './Page.module.scss';
import { SheetsNav } from '../SheetsNav/SheetsNav';
import { SearchResults } from 'components/search/SearchResults';
import { useToast } from 'components/shared/Toast/Toast';
import { BreadcrumbProps, Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthorRequestModel } from 'domain/api/JsModels';
import { Paths } from 'utils/routes/Paths';
import { AuthorAddModal } from 'components/sheets/AuthorAddModal/AuthorAddModal';
import { ErrorBoundary } from 'components/shared/ErrorBoundary/ErrorBoundary';
import { isDarkTheme } from 'redux/slices/app';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { addAuthor } from 'redux/slices/author';
import { SpinnerMusic } from 'components/shared/SpinnerMusic/SpinnerMusic';
import { Spinner } from 'components/shared/Spinner/Spinner';

interface Props {
    className?: string;
    loading?: boolean;
    children: React.ReactNode;
    hideSheetsNav?: boolean;
    breadcrumbs?: BreadcrumbProps[];
    showAddAuthorBtn?: boolean;
}

export const Page: React.FC<Props> = ({
    className,
    children,
    loading = false,
    hideSheetsNav = false,
    breadcrumbs,
    showAddAuthorBtn = false,
}) => {
    const dispatch = useAppDispatch();
    const [showAddAuthorModal, setShowAddAuthorModal] = React.useState<boolean>(false);

    const isDark = useAppSelector(isDarkTheme);
    const { search, user, app } = useAppSelector((state) => state);
    const {
        status: userStatus,
        currentUser: { is_superuser: isSuperUser },
    } = user;
    const searchApplied = search.applied;
    const { status: appStatus, warning } = app;

    const navigate = useNavigate();

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
        dispatch(addAuthor(formData))
            .unwrap()
            .then((res) => {
                if (res) {
                    navigate(Paths.getAuthorPath(res.name.charAt(0), res.alias));
                }
            });
        closeAddAuthorModal();
    };

    return (
        <div className={cn(styles.backplate, isDark && styles.backplate__dark)}>
            <ErrorBoundary>
                {!hideSheetsNav && <SheetsNav isDark={isDark} />}
                <div className={cn(styles.root, className)}>
                    {!!breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                    {isSuperUser && showAddAuthorBtn && !searchApplied && (
                        <div
                            onClick={openAddAuthorModal}
                            className={styles.addAuthor}
                            title="Добавить автора"
                        />
                    )}
                    {loading ? <Spinner withBackground /> : output}
                    {(appStatus.isRequest() || userStatus.isRequest()) && (
                        <Spinner withBackground />
                    )}
                </div>
                {toast}
                {showAddAuthorModal && (
                    <AuthorAddModal closeModal={closeAddAuthorModal} addAuthor={addAuthorHandler} />
                )}
            </ErrorBoundary>
        </div>
    );
};
