import { Spinner } from 'components/shared/Spinner/Spinner';
import * as React from 'react';
import { SearchApiResults } from 'store/sheetsReducer';
import styles from './SearchResults.scss';
import defaultStyles from 'styles/app.scss';
import cn from 'classnames';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import { SheetsClient } from 'api/SheetsClient';
import { SiteName } from 'domain/SiteInfo';
import { useAuth } from 'api/UsersClient';

interface Props {
    search: SearchApiResults;
    skipSearch: () => void;
    searchSheets: (query: string, page: number) => void;
    searchAuthors: (query: string, page: number) => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
}

export const SearchResults: React.FC<Props> = ({
    search,
    skipSearch,
    searchSheets,
    searchAuthors,
    editAuthor,
    removeAuthor,
}) => {
    let output: React.ReactNode;
    const [pageNumberSheet, setPageNumberSheet] = React.useState<number>(1);
    const [pageNumberAuthor, setPageNumberAuthor] = React.useState<number>(1);
    const location = useLocation();
    const [logged] = useAuth();

    const getSheetsByPage = (page: number) => {
        searchSheets(search.query, page);
        setPageNumberSheet(page);
    };

    const getAuthorByPage = (page: number) => {
        searchAuthors(search.query, page);
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
        SheetsClient.getAuthorById(sheet.author).then((res) => {
            const path = Paths.getSheetDownloadPath(
                res.name.charAt(0),
                res.alias,
                sheet.id.toString(),
            );
            window.open(path, '_blank');
        });
    };

    if (search.sheets.results.length > 0 || search.authors.results.length > 0) {
        output = search.status.isRequest() ? (
            <Spinner />
        ) : (
            <>
                <h1 className={defaultStyles.title}>Результаты поиска</h1>
                <a className={styles.dropSearch} onClick={skipSearch}>
                    Сбросить поиск
                    <span className={styles.closeIcon}></span>
                </a>

                {search.sheets.results.length > 0 && (
                    <>
                        <h2>Найденные ноты</h2>
                        <div className={styles.searchItems}>
                            {search.sheets.results.map((sheet) => (
                                <div
                                    key={sheet.id}
                                    className={styles.searchItem}
                                    onClick={() => openDownloadPage(sheet)}
                                >
                                    {sheet.name}
                                </div>
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
                        <h2>Найденные композиторы</h2>
                        <div className={cn(styles.searchItems, styles.searchAuthors)}>
                            {search.authors.results.map((author) => (
                                <AuthorCard
                                    key={author.id}
                                    author={author}
                                    className={styles.searchAuthor}
                                    firstAuthorletter={author.name.charAt(0)}
                                    editable={logged}
                                    editAuthor={editAuthor}
                                    removeAuthor={removeAuthor}
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
            </>
        );
    } else {
        output = <>По запросу &laquo;{search.query}&raquo; ничего не найдено</>;
    }

    return <>{output}</>;
};
