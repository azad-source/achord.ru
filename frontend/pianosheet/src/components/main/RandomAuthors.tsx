import * as React from 'react';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Page } from 'components/shared/layout/Page/Page';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useGetRandomAuthorsQuery, useGetRandomSheetsQuery } from 'redux/api';
import { openDownloadPage } from 'hooks/openDownloadPage';
import authorsStyles from 'styles/authors.module.scss';
import mainStyles from './main.module.scss';

export const RandomAuthors = () => {
    const { data: authors, isFetching: isAuthorsLoading } = useGetRandomAuthorsQuery();
    const { data: sheets, isFetching: isSheetsLoading } = useGetRandomSheetsQuery();

    const authorsList = authors?.results || [];
    const sheetsList = sheets?.results || [];

    return (
        <Page hideSheetsNav loading={isAuthorsLoading || isSheetsLoading}>
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
        </Page>
    );
};
