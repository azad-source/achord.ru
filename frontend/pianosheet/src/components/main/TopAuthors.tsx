import * as React from 'react';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Page } from 'components/shared/layout/Page/Page';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useGetTopAuthorsQuery, useGetTopSheetsQuery } from 'redux/api';
import { useOpenDownloadPage } from 'hooks/openDownloadHook';
import authorsStyles from 'styles/authors.module.scss';
import mainStyles from './main.module.scss';

export const TopAuthors = () => {
    const { data: authors, isLoading: isAuthorsLoading } = useGetTopAuthorsQuery();
    const { data: sheets, isLoading: isSheetsLoading } = useGetTopSheetsQuery();

    const authorsList = authors?.results || [];
    const sheetsList = sheets?.results || [];

    return (
        <Page hideSheetsNav loading={isAuthorsLoading || isSheetsLoading}>
            <TextPlain className={mainStyles.title}>Авторы</TextPlain>
            <div className={authorsStyles.authors}>
                {authorsList.map((item) => (
                    <AuthorCard
                        key={item.id}
                        author={item}
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
                        onOpen={useOpenDownloadPage}
                    />
                ))}
            </div>
        </Page>
    );
};
