import { SheetsClient } from 'api/SheetsClient';
import {
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
import { AuthorCard } from 'components/sheets/AuthorCard/AuthorCard';

interface Props {}

const TopAuthorsFC: React.FC<Props> = ({}) => {
    const [topSheets, setTopSheets] =
        React.useState<SheetJsModel>(defaultSheet);
    const [topAuthors, setTopAuthors] =
        React.useState<AuthorJsModel>(defaultAuthor);

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
            <h1 className={defaultStyles.title}>Топ 10 Композиций</h1>
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
                                authorName={author.name}
                                authorAlias={author.alias}
                                authorPreview={author.preview_s}
                                className={styles.topAuthorItem}
                                firstAuthorletter={author.name.charAt(0)}
                                index={index + 1}
                            />
                        );
                    }
                })}
            </ol>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    authors: state.sheets.authors,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({}, dispatch);
};

export const TopAuthors = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TopAuthorsFC);
