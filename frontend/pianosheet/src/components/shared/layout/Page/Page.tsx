import * as React from 'react';
import cn from 'classnames';
import styles from './Page.module.scss';
import { SheetsNav } from '../SheetsNav/SheetsNav';
import { SearchResults } from 'components/search/SearchResults';
import { useToast } from 'components/shared/Toast/Toast';
import { BreadcrumbProps, Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { AuthorAddModal } from 'components/sheets/AuthorAddModal/AuthorAddModal';
import { ErrorBoundary } from 'components/shared/ErrorBoundary/ErrorBoundary';
import { appSelector, isDarkTheme } from 'redux/slices/appSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Spinner } from 'components/shared/Spinner/Spinner';
import { useAddAuthorMutation } from 'redux/api/authorApi';
import { AddAuthorRequest } from 'redux/models/authorModels';
import { dropSearch, searchSelector } from 'redux/slices/searchSlice';
import { currentUserSelector } from 'redux/slices/userSlice';

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
    const [addAuthor] = useAddAuthorMutation();
    const [showAddAuthorModal, setShowAddAuthorModal] = React.useState<boolean>(false);

    const { applied: searchApplied } = useAppSelector(searchSelector);
    const { is_superuser: isSuperUser } = useAppSelector(currentUserSelector);
    const { warning } = useAppSelector(appSelector);
    const isDark = useAppSelector(isDarkTheme);

    const navigate = useNavigate();
    const { toast, push } = useToast();
    const { pathname } = useLocation();

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(dropSearch());
    }, [pathname]);

    React.useEffect(() => {
        if (warning) push(warning);
    }, [warning]);

    const closeAddAuthorModal = () => setShowAddAuthorModal(false);
    const openAddAuthorModal = () => setShowAddAuthorModal(true);

    const addAuthorHandler = (options: AddAuthorRequest) => {
        let formData = new FormData();
        formData.append('preview', options.preview);
        formData.append('name', options.name);
        formData.append('info', options.info);
        formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
        addAuthor(options)
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
                    {loading ? (
                        <Spinner withBackground />
                    ) : searchApplied ? (
                        <SearchResults />
                    ) : (
                        children
                    )}
                    {
                        /** appStatus.isRequest() || */ false /**userStatus.isRequest() */ && (
                            <Spinner withBackground />
                        )
                    }
                </div>
                {toast}
                {showAddAuthorModal && (
                    <AuthorAddModal closeModal={closeAddAuthorModal} addAuthor={addAuthorHandler} />
                )}
            </ErrorBoundary>
        </div>
    );
};
