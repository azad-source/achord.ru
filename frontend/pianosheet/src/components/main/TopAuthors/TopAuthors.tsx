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
import { defaultAuthor, defaultSheet } from 'store/sheetsReducer';
import styles from './TopAuthors.scss';
import defaultStyles from 'styles/app.scss';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { useAuth } from 'api/UsersClient';
import { sheetsAction } from 'store/sheetsActions';

interface Props {
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
}

const TopAuthorsFC: React.FC<Props> = ({ editAuthor }) => {
    const [topSheets, setTopSheets] = React.useState<SheetJsModel>(defaultSheet);
    const [topAuthors, setTopAuthors] = React.useState<AuthorJsModel>(defaultAuthor);
    const [logged] = useAuth();

    React.useEffect(() => {
        SheetsClient.getTopSheets().then((res) => {
            setTopSheets(res);
        });
        SheetsClient.getTopAuthors().then((res) => {
            setTopAuthors(res);
        });
    }, []);

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
        <div className={styles.root}>
            <h1 className={defaultStyles.title}>Топ 10</h1>
            <ol className={styles.topSheets}>
                {topSheets.results.map((sheet, index) => {
                    if (index < 10) {
                        return (
                            <li
                                key={index}
                                className={styles.topSheetItem}
                                onClick={() => openDownloadPage(sheet)}
                            >
                                {sheet.name}
                            </li>
                        );
                    }
                })}
            </ol>
            <ol className={styles.topAuthors}>
                {topAuthors.results.map((author, index) => {
                    if (index < 10) {
                        return (
                            <AuthorCard
                                key={author.id}
                                author={author}
                                className={styles.topAuthorItem}
                                firstAuthorletter={author.name.charAt(0)}
                                index={index + 1}
                                editable={logged}
                                editAuthor={editAuthor}
                            />
                        );
                    }
                })}
            </ol>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            editAuthor: sheetsAction.editAuthor,
        },
        dispatch,
    );
};

export const TopAuthors = connect(mapStateToProps, mapDispatchToProps)(TopAuthorsFC);
