import * as React from 'react';
import styles from './AuthorPage.scss';
import cn from 'classnames';
import { Page } from 'components/shared/layout/Page/Page';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { AuthorItemJsModel, AuthorRequestModel, SheetJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { AddIcon } from 'components/shared/icons/AddIcon';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { Paths } from 'utils/routes/Paths';
import { useAuth } from 'api/UsersClient';
import { SheetAddModal, sheetAddModel } from '../SheetAddModal/SheetAddModal';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { AuthorEditModal } from '../AuthorEditModal/AuthorEditModal';
import { Button } from 'components/shared/Button/Button';
import { EditIcon } from 'components/shared/icons/EditIcon';
import { SiteName } from 'domain/SiteInfo';
import { FavoriteIcon } from 'components/shared/icons/FavoriteIcon';
import { LikeIcon } from 'components/shared/icons/LikeIcon';

interface Props {
    className?: string;
    author: AuthorItemJsModel;
    sheets: SheetJsModel;
    status: QueryStatus;
    isSuperUser?: boolean;
    getAuthor: (alias: string) => void;
    getSheets: (alias: string, page: number) => void;
    addSheet: (sheet: FormData) => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    addAuthorToFavorite: (authorId: number, isFavorite: boolean) => void;
    addSheetToFavorite: (sheetId: number, isFavorite: boolean) => void;
    likeAuthor: (authorId: number, hasLike: boolean) => void;
    likeSheet: (sheetId: number, hasLike: boolean) => void;
}

const AuthorPageFC: React.FC<Props> = ({
    className,
    author,
    sheets,
    status,
    isSuperUser = false,
    getAuthor,
    getSheets,
    addSheet,
    editAuthor,
    addAuthorToFavorite,
    addSheetToFavorite,
    likeAuthor,
    likeSheet,
}) => {
    const [logged] = useAuth();
    const { letter, authorAlias } = useParams<{ letter: string; authorAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [showSheetAddModal, setShowSheetAddModal] = React.useState<boolean>(false);
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);

    const location = useLocation();
    const history = useHistory();

    React.useEffect(() => {
        getAuthor(authorAlias);
        setPageNumber(1);
    }, [location]);

    React.useEffect(() => {
        document.title = `${SiteName} - ${author.name}`;
    }, [location, author]);

    const openSheetAddModal = () => setShowSheetAddModal(true);
    const closeSheetAddModal = () => setShowSheetAddModal(false);
    const closeEditModal = () => setShowEditModal(false);
    const openEditModal = () => setShowEditModal(true);

    const addSheetHandler = (options: sheetAddModel) => {
        let formData = new FormData();
        formData.append('filename', options.filename);
        formData.append('name', options.sheetname);
        formData.append('author', author.id.toString());
        addSheet(formData);
        closeSheetAddModal();
    };

    const getSheetsByPage = (page: number) => {
        getSheets(authorAlias, page);
        setPageNumber(page);
    };

    const editAuthorHandler = (options: AuthorRequestModel) => {
        let formData = new FormData();
        if (options.preview !== author.preview) formData.append('preview', options.preview);
        if (options.name !== author.name) formData.append('name', options.name);
        if (options.info !== author.info) formData.append('info', options.info);
        if (options.genres !== author.genres)
            formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
        editAuthor(author.id, formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.name.charAt(0), res.alias));
            }
        });
        closeEditModal();
    };

    const breadcrumbs: BreadcrumbProps[] = [
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

    const swithFavoriteAuthor = () => {
        addAuthorToFavorite(author.id, !author.favorite);
    };

    const swithLikeAuthor = () => {
        likeAuthor(author.id, !author.like);
    };

    return (
        <Page breadcrumbs={breadcrumbs}>
            <div className={cn(styles.root, className)}>
                <div className={styles.title}>
                    <div className={styles.authorName}>{author.name}</div>
                    {logged && (
                        <div className={styles.actions}>
                            {isSuperUser && (
                                <Button
                                    className={styles.editBtn}
                                    use="link"
                                    onClick={openEditModal}
                                    disabled={status.isRequest()}
                                >
                                    <EditIcon />
                                </Button>
                            )}
                            <Button
                                className={cn(styles.likeBtn, author.like && styles.likeBtn_active)}
                                use="link"
                                onClick={swithLikeAuthor}
                                title={author.like ? 'Убрать лайк' : 'Поставить лайк'}
                                disabled={status.isRequest()}
                            >
                                {author.like_count}{' '}
                                <LikeIcon className={styles.likeIcon} active={author.like} />
                            </Button>
                            <Button
                                className={cn(
                                    styles.favoriteBtn,
                                    author.favorite && styles.favoriteBtn_active,
                                )}
                                use="link"
                                onClick={swithFavoriteAuthor}
                                title={
                                    author.favorite ? 'Убрать из избранных' : 'Добавить в избранное'
                                }
                                disabled={status.isRequest()}
                            >
                                <FavoriteIcon active={author.favorite} />
                            </Button>
                        </div>
                    )}
                </div>

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
                                {sheets.results.map(({ name, id, favorite }) => (
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
                                        {logged && (
                                            <Button
                                                className={cn(
                                                    styles.favoriteBtn,
                                                    favorite && styles.favoriteBtn_active,
                                                )}
                                                use="link"
                                                onClick={() => addSheetToFavorite(id, !favorite)}
                                                title={
                                                    favorite
                                                        ? 'Убрать из избранных'
                                                        : 'Добавить в избранное'
                                                }
                                                disabled={status.isRequest()}
                                            >
                                                <FavoriteIcon active={favorite} />
                                            </Button>
                                        )}
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
                            <div className={cn(styles.sheetItemAdd)} onClick={openSheetAddModal}>
                                <AddIcon className={styles.addSheetIcon} />
                                Добавить ноты
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showSheetAddModal && (
                <SheetAddModal closeModal={closeSheetAddModal} addSheet={addSheetHandler} />
            )}
            {showEditModal && (
                <AuthorEditModal
                    closeModal={closeEditModal}
                    editAuthor={editAuthorHandler}
                    author={author}
                />
            )}
        </Page>
    );
};

const mapStateToProps = ({ sheets: { author, sheets, status }, users }: RootState) => ({
    author,
    sheets,
    status,
    isSuperUser: users.currentUser.is_superuser,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getAuthor: sheetsAction.getAuthor,
            getSheets: sheetsAction.getSheets,
            addSheet: sheetsAction.addSheet,
            editAuthor: sheetsAction.editAuthor,
            addAuthorToFavorite: sheetsAction.addAuthorToFavorite,
            addSheetToFavorite: sheetsAction.addSheetToFavorite,
            likeAuthor: sheetsAction.likeAuthor,
            likeSheet: sheetsAction.likeSheet,
        },
        dispatch,
    );
};

export const AuthorPage = connect(mapStateToProps, mapDispatchToProps)(AuthorPageFC);
