import * as React from 'react';
import styles from './AuthorPage.scss';
import cn from 'classnames';
import { Page } from 'components/shared/layout/Page/Page';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorItemJsModel, SheetJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { AddIcon } from 'components/shared/icons/AddIcon';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { Paths } from 'utils/routes/Paths';
import { useAuth } from 'api/UsersClient';
import { Breadcrumbs } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { SheetAddModal, sheetAddModel } from '../SheetAddModal/SheetAddModal';

interface Props {
    className?: string;
    author: AuthorItemJsModel;
    sheets: SheetJsModel;
    status: QueryStatus;
    getAuthor: (alias: string) => void;
    getSheets: (alias: string, page: number) => void;
    addSheet: (sheet: FormData) => void;
}

const AuthorPageFC: React.FC<Props> = ({
    className,
    author,
    sheets,
    status,
    getAuthor,
    getSheets,
    addSheet,
}) => {
    const [logged] = useAuth();
    const { letter, authorAlias } = useParams<{ letter: string; authorAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [showModal, setShowModal] = React.useState<boolean>(false);

    const location = useLocation();
    const history = useHistory();

    React.useEffect(() => {
        getAuthor(authorAlias);
        setPageNumber(1);
    }, [location]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const addSheetHandler = (options: sheetAddModel) => {
        let formData = new FormData();
        formData.append('filename', options.filename);
        formData.append('name', options.sheetname);
        formData.append('author', author.id.toString());
        addSheet(formData);
        closeModal();
    };

    const getSheetsByPage = (page: number) => {
        getSheets(authorAlias, page);
        setPageNumber(page);
    };

    const breadcrumbs: { caption: string; link?: string }[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: letter.toUpperCase(),
            link: Paths.getLetterPath(letter),
        },
        {
            caption: author.name,
        },
    ];

    const goToGenre = (genreAlias: string) => {
        history.push(Paths.getGenrePage(genreAlias));
    };

    return (
        <Page loadStatus={status}>
            <Breadcrumbs items={breadcrumbs} />
            <div className={cn(styles.root, className)}>
                <div className={styles.title}>{author.name}</div>
                <div className={styles.content}>
                    <div className={styles.description}>
                        <div>
                            <div className={styles.photo}>
                                <img
                                    src={author.preview}
                                    alt={author.name}
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.genres}>
                                {author.genres.map(({ name, id, alias }) => (
                                    <div
                                        key={id}
                                        className={styles.genres_item}
                                        onClick={() => goToGenre(alias)}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.authorInfo}>{author.info}</div>
                    </div>
                    <div className={styles.sheetTitle}>НОТЫ</div>
                    {sheets.page_count > 1 && (
                        <Pagination
                            pageNumber={pageNumber}
                            pageCount={sheets.page_count}
                            switchPage={getSheetsByPage}
                            size="small"
                        />
                    )}
                    <div className={styles.sheets}>
                        {sheets.results && sheets.results.length > 0 ? (
                            <>
                                {sheets.results.map(({ name, id }) => (
                                    <div key={id} className={styles.sheetItem}>
                                        <a
                                            href={Paths.getSheetDownloadPath(
                                                letter,
                                                authorAlias,
                                                id.toString(),
                                            )}
                                            className={styles.sheetLink}
                                            target="blank_"
                                        >
                                            {name}
                                        </a>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className={styles.notYetSheets}>Тут скоро появятся ноты</div>
                        )}
                        {sheets.page_count > 1 && (
                            <Pagination
                                pageNumber={pageNumber}
                                pageCount={sheets.page_count}
                                switchPage={getSheetsByPage}
                                size="small"
                            />
                        )}
                        {logged && (
                            <div className={cn(styles.sheetItemAdd)} onClick={openModal}>
                                <AddIcon className={styles.addSheetIcon} />
                                Добавить ноты
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showModal && <SheetAddModal closeModal={closeModal} addSheet={addSheetHandler} />}
        </Page>
    );
};

const mapStateToProps = (state: RootState) => ({
    author: state.sheets.author,
    sheets: state.sheets.sheets,
    status: state.sheets.status,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getAuthor: sheetsAction.getAuthor,
            getSheets: sheetsAction.getSheets,
            addSheet: sheetsAction.addSheet,
        },
        dispatch,
    );
};

export const AuthorPage = connect(mapStateToProps, mapDispatchToProps)(AuthorPageFC);
