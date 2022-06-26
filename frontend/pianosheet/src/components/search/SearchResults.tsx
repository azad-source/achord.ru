import { Spinner } from 'components/shared/Spinner/Spinner';
import * as React from 'react';
import { SearchApiResults } from 'store/sheetsReducer';
import styles from './SearchResults.scss';
import cn from 'classnames';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import { SheetsClient } from 'api/SheetsClient';
import { SiteName } from 'domain/SiteInfo';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { RootState } from 'store/rootReducer';
import { useAuth } from 'api/UsersClient';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { Link } from 'components/shared/Link/Link';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';

interface Props {
    search: SearchApiResults;
    isSuperUser?: boolean;
    skipSearch: () => void;
    searchSheets: (query: string, page: number) => void;
    searchAuthors: (query: string, page: number) => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
    addAuthorToFavorite: (authorId: number, isFavorite: boolean) => void;
    addSheetToFavorite: (sheetId: number, isFavorite: boolean) => void;
}

const SearchResultsFC: React.FC<Props> = ({
    search,
    isSuperUser = false,
    editAuthor,
    removeAuthor,
    skipSearch,
    searchSheets,
    searchAuthors,
    addAuthorToFavorite,
    addSheetToFavorite,
}) => {
    let output: React.ReactNode;
    const [pageNumberSheet, setPageNumberSheet] = React.useState<number>(1);
    const [pageNumberAuthor, setPageNumberAuthor] = React.useState<number>(1);
    const location = useLocation();

    const [logged] = useAuth();

    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

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
            <div className={cn(styles.root, isDark && styles.root__dark)}>
                <TextPlain className={styles.title}>Результаты поиска</TextPlain>
                <Link className={styles.dropSearch} onClick={skipSearch}>
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
                                    addToFavorite={logged ? addSheetToFavorite : undefined}
                                    
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
                                    editAuthor={isSuperUser ? editAuthor : undefined}
                                    removeAuthor={isSuperUser ? removeAuthor : undefined}
                                    addAuthorToFavorite={logged ? addAuthorToFavorite : undefined}
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

const mapStateToProps = ({ sheets, users: { currentUser } }: RootState) => ({
    search: sheets.search,
    isSuperUser: currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            skipSearch: sheetsAction.dropSearch,
            searchSheets: sheetsAction.searchSheetsByPage,
            searchAuthors: sheetsAction.searchAuthorsByPage,
            editAuthor: sheetsAction.editAuthor,
            removeAuthor: sheetsAction.removeAuthor,
            addAuthorToFavorite: sheetsAction.addAuthorToFavorite,
            addSheetToFavorite: sheetsAction.addSheetToFavorite,
        },
        dispatch,
    );
};

export const SearchResults = connect(mapStateToProps, mapDispatchToProps)(SearchResultsFC);
