import * as React from 'react';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Page } from 'components/shared/layout/Page/Page';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useGetFavoriteAuthorsQuery } from 'redux/api/authorApi';
import { openDownloadPage } from 'hooks/openDownloadPage';
import { useGetFavoriteSheetsQuery } from 'redux/api/sheetApi';
import authorsStyles from 'styles/authors.module.scss';
import mainStyles from './main.module.scss';

export const FavouriteAuthors = () => {
    const { data: authors, isFetching: isAuthorsLoading } = useGetFavoriteAuthorsQuery();
    const { data: sheets, isFetching: isSheetsLoading } = useGetFavoriteSheetsQuery();

    const authorsList = authors?.results || [];
    const sheetsList = sheets?.results || [];

    const hasAuthors = authorsList.length > 0;
    const hasSheets = sheetsList.length > 0;

    return (
        <Page hideSheetsNav loading={isAuthorsLoading || isSheetsLoading}>
            {hasAuthors && (
                <>
                    <TextPlain className={mainStyles.title}>Авторы</TextPlain>
                    <div className={authorsStyles.authors}>
                        {authorsList.map((author) => (
                            <AuthorCard
                                key={author.id}
                                author={author}
                                className={authorsStyles.authors__item}
                            />
                        ))}
                    </div>
                </>
            )}
            {hasSheets && (
                <>
                    <TextPlain className={mainStyles.title}>Композиции</TextPlain>
                    <div className={mainStyles.sheets}>
                        {sheetsList.map((sheet, index) => (
                            <SheetRow
                                key={sheet.id}
                                sheet={sheet}
                                index={index}
                                onOpen={openDownloadPage}
                            />
                        ))}
                    </div>
                </>
            )}

            {!hasAuthors && !hasSheets && (
                <div className={mainStyles.empty}>Список избранных пуст</div>
            )}
        </Page>
    );
};
