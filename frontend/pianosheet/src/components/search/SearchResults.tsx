import { SpinnerGrid } from 'components/shared/SpinnerGrid/SpinnerGrid';
import * as React from 'react';
import styles from './SearchResults.module.scss';
import cn from 'classnames';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import { SiteName } from 'domain/SiteInfo';
import { useAuth } from 'redux/api/UserClient';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { Link } from 'components/shared/Link/Link';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';
import { dropSearch, searchAuthorsByPage, searchSheetsByPage } from 'redux/slices/search';
import { AuthorClient } from 'redux/api/AuthorClient';
import { addSheetToFavorite } from 'redux/slices/sheet';
import { addAuthorToFavorite, editAuthor, removeAuthor } from 'redux/slices/author';
import { QueryStatus } from 'domain/QueryStatus';

export const SearchResults = () => {
    const dispatch = useAppDispatch();

    const {
        user,
        search,
        author: { currentStatus: authorStatus, current },
        sheet: { currentStatus: sheetStatus, current: currentSheet },
    } = useAppSelector((state) => state);
    const isSuperUser = user.currentUser.is_superuser;

    let output: React.ReactNode;
    const [pageNumberSheet, setPageNumberSheet] = React.useState<number>(1);
    const [pageNumberAuthor, setPageNumberAuthor] = React.useState<number>(1);
    const location = useLocation();

    const [logged] = useAuth();

    const isDark = useAppSelector(isDarkTheme);

    const getSheetsByPage = (page: number) => {
        dispatch(searchSheetsByPage({ query: search?.query, page }));
        setPageNumberSheet(page);
    };

    const getAuthorByPage = (page: number) => {
        dispatch(searchAuthorsByPage({ query: search.query, page }));
        setPageNumberAuthor(page);
    };

    React.useEffect(() => {
        setPageNumberSheet(1);
        setPageNumberAuthor(1);
    }, [location]);

    React.useEffect(() => {
        document.title = `${SiteName} - Поиск`;
    }, []);

    const openDownloadPage = (sheet: SheetItemJsModel) => {
        AuthorClient.getAuthorById(sheet.author).then((res) => {
            const path = Paths.getSheetDownloadPath(
                res.name.charAt(0),
                res.alias,
                sheet.id.toString(),
            );
            window.open(path, '_blank');
        });
    };

    const editAuthorHandler = (authorId: number, author: FormData) => {
        return dispatch(editAuthor({ authorId, author })).unwrap();
    };

    const removeAuthorHandler = (authorId: number) => {
        return dispatch(removeAuthor(authorId)).unwrap();
    };

    const addAuthorToFavHandler = (authorId: number, isFavorite: boolean) => {
        return dispatch(addAuthorToFavorite({ authorId, isFavorite })).unwrap();
    };

    const addSheetToFavHandler = (sheetId: number, isFavorite: boolean) => {
        return dispatch(addSheetToFavorite({ sheetId, isFavorite })).unwrap();
    };

    const getCardStatus = (author: AuthorItemJsModel): QueryStatus => {
        if (author.id === current?.id) {
            return authorStatus;
        }
        return QueryStatus.initial();
    };

    const getSheetStatus = (sheet: SheetItemJsModel): QueryStatus => {
        if (sheet.id === currentSheet?.id) {
            return sheetStatus;
        }
        return QueryStatus.initial();
    };

    if (search.sheets.results.length > 0 || search.authors.results.length > 0) {
        output = search.status.isRequest() ? (
            <SpinnerGrid />
        ) : (
            <div className={cn(styles.root, isDark && styles.root__dark)}>
                <TextPlain className={styles.title}>Результаты поиска</TextPlain>
                <Link className={styles.dropSearch} onClick={() => dispatch(dropSearch())}>
                    Сбросить поиск
                    <span className={styles.closeIcon} />
                </Link>

                {search.sheets.results.length > 0 && (
                    <>
                        <TextPlain className={styles.searchTitle}>Найденные ноты</TextPlain>
                        <div className={styles.searchItems}>
                            {search.sheets.results.map((sheet, index) => (
                                <SheetRow
                                    key={sheet.id}
                                    type="second"
                                    sheet={sheet}
                                    index={index}
                                    onOpen={openDownloadPage}
                                    addToFavorite={logged ? addSheetToFavHandler : undefined}
                                    status={getSheetStatus(sheet)}
                                />
                            ))}
                        </div>

                        {search.sheets.page_count > 1 && (
                            <Pagination
                                pageNumber={pageNumberSheet}
                                pageCount={search.sheets.page_count}
                                switchPage={getSheetsByPage}
                                size="small"
                                className={styles.pagination}
                            />
                        )}
                    </>
                )}

                {search.authors.results.length > 0 && (
                    <>
                        <div className={styles.searchTitle}>Найденные композиторы</div>
                        <div className={cn(styles.searchItems, styles.searchAuthors)}>
                            {search.authors.results.map((author) => (
                                <AuthorCard
                                    key={author.id}
                                    author={author}
                                    className={styles.searchAuthor}
                                    editAuthor={isSuperUser ? editAuthorHandler : undefined}
                                    removeAuthor={isSuperUser ? removeAuthorHandler : undefined}
                                    addAuthorToFavorite={logged ? addAuthorToFavHandler : undefined}
                                    status={getCardStatus(author)}
                                />
                            ))}
                        </div>
                        {search.authors.page_count > 1 && (
                            <Pagination
                                pageNumber={pageNumberAuthor}
                                pageCount={search.authors.page_count}
                                switchPage={getAuthorByPage}
                            />
                        )}
                    </>
                )}
            </div>
        );
    } else {
        output = <>По запросу &laquo;{search.query}&raquo; ничего не найдено</>;
    }

    return <>{output}</>;
};
