import { SheetItemJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import styles from './FavouriteAuthors.scss';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { Page } from 'components/shared/layout/Page/Page';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useAuth } from 'redux/api/UserClient';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    addAuthorToFavorite,
    editAuthor,
    getFavoriteAuthors,
    removeAuthor,
} from 'redux/slices/author';
import { addSheetToFavorite, getFavoriteSheets } from 'redux/slices/sheet';
import { AuthorClient } from 'redux/api/AuthorClient';

export const FavouriteAuthors = () => {
    const dispatch = useAppDispatch();

    const { author, sheet, user } = useAppSelector((state) => state);
    const { status: authorStatus, list: authors } = author;
    const { status: sheetStatus, list: sheets } = sheet;
    const isSuperUser = user.currentUser.is_superuser;

    React.useEffect(() => {
        dispatch(getFavoriteAuthors());
        dispatch(getFavoriteSheets());
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

    const hasAuthors = authors.results.length > 0;
    const hasSheets = sheets.results.length > 0;

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
            {hasAuthors && (
                <>
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
                </>
            )}

            {hasSheets && (
                <>
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
                </>
            )}

            {!hasAuthors && !hasSheets && <div className={styles.empty}>Список избранных пуст</div>}
        </Page>
    );
};
