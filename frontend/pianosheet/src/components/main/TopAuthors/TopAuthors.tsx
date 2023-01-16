import { SheetItemJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import styles from './TopAuthors.scss';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Page } from 'components/shared/layout/Page/Page';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { useAuth } from 'redux/api/UserClient';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { AuthorClient } from 'redux/api/AuthorClient';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { addAuthorToFavorite, editAuthor, getTopAuthors, removeAuthor } from 'redux/slices/author';
import { addSheetToFavorite, getTopSheets } from 'redux/slices/sheet';

export const TopAuthors = () => {
    const dispatch = useAppDispatch();

    const { author, sheet, user } = useAppSelector((state) => state);
    const { status: authorStatus, list: authors } = author;
    const { status: sheetStatus, list: sheets } = sheet;
    const isSuperUser = user.currentUser.is_superuser;

    React.useEffect(() => {
        dispatch(getTopAuthors());
        dispatch(getTopSheets());
    }, []);

    const [logged] = useAuth();

    const openDownloadPage = (sheet: SheetItemJsModel) => {
        AuthorClient.getAuthorById(sheet.author).then((author) => {
            const path = Paths.getSheetDownloadPath(
                author.name.charAt(0),
                author.alias,
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

    return (
        <Page hideSheetsNav loading={authorStatus.isRequest() || sheetStatus.isRequest()}>
            <TextPlain className={styles.title}>Авторы</TextPlain>
            <div className={styles.topAuthors}>
                {authors.results.map((author) => (
                    <AuthorCard
                        key={author.id}
                        author={author}
                        className={styles.topAuthors_item}
                        editAuthor={isSuperUser ? editAuthorHandler : undefined}
                        removeAuthor={isSuperUser ? removeAuthorHandler : undefined}
                        addAuthorToFavorite={logged ? addAuthorToFavHandler : undefined}
                    />
                ))}
            </div>
            <TextPlain className={styles.title}>Композиции</TextPlain>
            <div className={styles.topSheets}>
                {sheets.results.map((sheet, index) => (
                    <SheetRow
                        key={sheet.id}
                        sheet={sheet}
                        index={index}
                        onOpen={openDownloadPage}
                        addToFavorite={logged ? addSheetToFavHandler : undefined}
                    />
                ))}
            </div>
        </Page>
    );
};
