import { SheetsClient } from 'api/SheetsClient';
import {
    AuthorItemJsModel,
    AuthorJsModel,
    SheetItemJsModel,
    SheetJsModel,
} from 'domain/api/JsModels';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'store/rootReducer';
import styles from './TopAuthors.scss';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { sheetsAction } from 'store/sheetsActions';
import { Page } from 'components/shared/layout/Page/Page';
import { QueryStatus } from 'domain/QueryStatus';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { useAuth } from 'api/UsersClient';

interface Props {
    authors: AuthorJsModel;
    sheets: SheetJsModel;
    status: QueryStatus;
    isSuperUser?: boolean;
    getAuthors: () => void;
    getSheets: () => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
    addAuthorToFavorite: (authorId: number, isFavorite: boolean) => void;
    addSheetToFavorite: (sheetId: number, isFavorite: boolean) => void;
}

const TopAuthorsFC: React.FC<Props> = ({
    authors,
    sheets,
    status,
    isSuperUser = false,
    getAuthors,
    getSheets,
    editAuthor,
    removeAuthor,
    addAuthorToFavorite,
    addSheetToFavorite,
}) => {
    React.useEffect(() => {
        getAuthors();
        getSheets();
    }, []);

    const [logged] = useAuth();

    const openDownloadPage = (sheet: SheetItemJsModel) => {
        SheetsClient.getAuthorById(sheet.author).then((author) => {
            const path = Paths.getSheetDownloadPath(
                author.name.charAt(0),
                author.alias,
                sheet.id.toString(),
            );
            window.open(path, '_blank');
        });
    };

    return (
        <Page loadStatus={status} hideSheetsNav>
            <div className={styles.title}>Авторы</div>
            <div className={styles.topAuthors}>
                {authors.results.map((author) => (
                    <AuthorCard
                        key={author.id}
                        author={author}
                        className={styles.topAuthors_item}
                        isSuperUser={isSuperUser}
                        editAuthor={editAuthor}
                        removeAuthor={removeAuthor}
                        addAuthorToFavorite={addAuthorToFavorite}
                    />
                ))}
            </div>
            <div className={styles.title}>Композиции</div>
            <ol className={styles.topSheets}>
                {sheets.results.map((sheet, index) => (
                    <SheetRow
                        key={sheet.id}
                        sheet={sheet}
                        index={index}
                        onOpen={openDownloadPage}
                        addToFavorite={logged ? addSheetToFavorite : undefined}
                    />
                ))}
            </ol>
        </Page>
    );
};

const mapStateToProps = ({
    sheets: { authors, sheets, status },
    users: { currentUser },
}: RootState) => ({
    authors,
    sheets,
    status,
    isSuperUser: currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getAuthors: sheetsAction.getTopAuthors,
            getSheets: sheetsAction.getTopSheets,
            editAuthor: sheetsAction.editAuthor,
            removeAuthor: sheetsAction.removeAuthor,
            addAuthorToFavorite: sheetsAction.addAuthorToFavorite,
            addSheetToFavorite: sheetsAction.addSheetToFavorite,
        },
        dispatch,
    );
};

export const TopAuthors = connect(mapStateToProps, mapDispatchToProps)(TopAuthorsFC);
