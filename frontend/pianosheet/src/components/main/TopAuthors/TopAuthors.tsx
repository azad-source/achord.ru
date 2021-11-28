import { SheetsClient } from 'api/SheetsClient';
import { AuthorJsModel, SheetItemJsModel, SheetJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'store/rootReducer';
import styles from './TopAuthors.scss';
import defaultStyles from 'styles/app.scss';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { sheetsAction } from 'store/sheetsActions';

interface Props {
    authors: AuthorJsModel;
    sheets: SheetJsModel;
    getTopAuthors: () => void;
    getTopSheets: () => void;
}

const TopAuthorsFC: React.FC<Props> = ({ authors, sheets, getTopAuthors, getTopSheets }) => {
    React.useEffect(() => {
        getTopAuthors();
        getTopSheets();
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
        <>
            <h1 className={defaultStyles.title}>Топ 10</h1>
            <ol className={styles.topSheets}>
                {sheets.results.map((sheet, index) => {
                    if (index < 10) {
                        return (
                            <li
                                key={index}
                                className={styles.topSheets_item}
                                onClick={() => openDownloadPage(sheet)}
                            >
                                {sheet.name}
                            </li>
                        );
                    }
                })}
            </ol>
            <div className={styles.topAuthors}>
                {authors.results.map((author, index) => {
                    if (index < 10) {
                        return (
                            <AuthorCard
                                key={author.id}
                                author={author}
                                className={styles.topAuthors_item}
                            />
                        );
                    }
                })}
            </div>
        </>
    );
};

const mapStateToProps = ({ sheets: { authors, sheets } }: RootState) => ({
    authors,
    sheets,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getTopAuthors: sheetsAction.getTopAuthors,
            getTopSheets: sheetsAction.getTopSheets,
        },
        dispatch,
    );
};

export const TopAuthors = connect(mapStateToProps, mapDispatchToProps)(TopAuthorsFC);
