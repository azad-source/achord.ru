import { SpinnerGrid } from 'components/shared/SpinnerGrid/SpinnerGrid';
import * as React from 'react';
import styles from './SearchResults.module.scss';
import cn from 'classnames';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useLocation } from 'react-router-dom';
import { SiteName } from 'domain/SiteInfo';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { Link } from 'components/shared/Link/Link';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';
import { useOpenDownloadPage } from 'hooks/openDownloadHook';
import { useSearchAuthorsQuery, useSearchSheetsQuery } from 'redux/api';
import { dropSearch, searchSelector } from 'redux/slices/searchSlice';
import { SHEETS_SEARCH_SIZE } from 'utils/constants';
import authorsStyles from 'styles/authors.module.scss';

interface PagesState {
    authors: number;
    sheets: number;
}

const defaultPages: PagesState = { authors: 1, sheets: 1 };

export const SearchResults = () => {
    const [pages, setPages] = React.useState<PagesState>({ ...defaultPages });

    const location = useLocation();

    const dispatch = useAppDispatch();

    const { query } = useAppSelector(searchSelector);

    const { data: authors, isFetching: isAuthorsLoading } = useSearchAuthorsQuery({
        query,
        page: pages.authors,
    });

    const { data: sheets, isFetching: isSheetsLoading } = useSearchSheetsQuery({
        query,
        page: pages.sheets,
    });

    React.useEffect(() => {
        setPages({ ...defaultPages });
        document.title = `${SiteName} - Поиск`;
    }, [location]);

    const authorsList = authors?.results || [];

    const sheetsList = sheets?.results || [];

    const hasResult = sheetsList.length > 0 || authorsList.length > 0;

    const isLoading = isAuthorsLoading || isSheetsLoading;

    const { query: searchQuery } = useAppSelector(searchSelector);

    const isDark = useAppSelector(isDarkTheme);

    const handleChangePage = (target: keyof PagesState) => {
        return (val: number) => setPages((p) => ({ ...p, [target]: val }));
    };

    const handleDropSearch = () => dispatch(dropSearch());

    if (!hasResult && !isLoading) {
        return (
            <>
                <br />
                <div>
                    По запросу <strong>&laquo;{searchQuery}&raquo;</strong> ничего не найдено
                </div>
                <div>
                    <br />
                    <div>Рекомендации:</div>
                    <ul>
                        <li>Убедитесь, что все слова написаны без ошибок.</li>
                        <li>Попробуйте использовать другие ключевые слова.</li>
                        <li>Попробуйте использовать более популярные ключевые слова.</li>
                    </ul>
                </div>
            </>
        );
    }

    if (isLoading) {
        return <SpinnerGrid />;
    }

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            <TextPlain className={styles.title}>Результаты поиска</TextPlain>
            <Link className={styles.dropSearch} onClick={handleDropSearch}>
                Сбросить поиск
                <span className={styles.closeIcon} />
            </Link>
            {sheetsList.length > 0 && (
                <>
                    <TextPlain className={styles.searchTitle}>Найденные ноты</TextPlain>
                    <div className={styles.items}>
                        {sheetsList.map((sheet, index) => (
                            <SheetRow
                                key={sheet.id}
                                type="second"
                                sheet={sheet}
                                index={index + (pages.sheets - 1) * SHEETS_SEARCH_SIZE}
                                onOpen={useOpenDownloadPage}
                            />
                        ))}
                    </div>
                    {sheets && sheets?.page_count > 1 && (
                        <Pagination
                            pageNumber={pages.sheets}
                            pageCount={sheets.page_count}
                            switchPage={handleChangePage('sheets')}
                            size="small"
                            className={styles.pagination}
                        />
                    )}
                </>
            )}
            {authorsList.length > 0 && (
                <>
                    <div className={styles.searchTitle}>Найденные композиторы</div>
                    <div className={cn(styles.items, authorsStyles.authors)}>
                        {authorsList.map((author) => (
                            <AuthorCard
                                key={author.id}
                                author={author}
                                className={styles.authorCard}
                            />
                        ))}
                    </div>
                    {authors && authors?.page_count > 1 && (
                        <Pagination
                            pageNumber={pages.authors}
                            pageCount={authors.page_count}
                            switchPage={handleChangePage('authors')}
                        />
                    )}
                </>
            )}
        </div>
    );
};
