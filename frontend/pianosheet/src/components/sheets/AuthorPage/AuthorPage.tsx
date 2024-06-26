import * as React from 'react';
import styles from './AuthorPage.module.scss';
import cn from 'classnames';
import { Page } from 'components/shared/layout/Page/Page';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { SheetItemJsModel } from 'domain/api/JsModels';
import { AddIcon } from 'components/shared/icons/AddIcon';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { Paths } from 'utils/routes/Paths';
import { SheetAddModal } from '../SheetAddModal/SheetAddModal';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { AuthorEditModal } from '../AuthorEditModal/AuthorEditModal';
import { Button } from 'components/shared/Button/Button';
import { EditIcon } from 'components/shared/icons/EditIcon';
import { SiteName } from 'domain/SiteInfo';
import { FavoriteIcon } from 'components/shared/icons/FavoriteIcon';
import { LikeIcon } from 'components/shared/icons/LikeIcon';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';
import {
    useAddAuthorToFavoriteMutation,
    useAddLikeToAuthorMutation,
    useEditAuthorByIdMutation,
    useLazyGetAuthorByAliasQuery,
    useAddSheetMutation,
    useLazyGetSheetsQuery,
} from 'redux/api';
import { EditAuthorByIdRequest } from 'redux/models/authorModels';
import { AddSheetRequest } from 'redux/models/sheetModels';
import { useAuth } from 'redux/apiConfig';

export const AuthorPage = () => {
    const [editAuthor] = useEditAuthorByIdMutation();
    const [getAuthor, { data: author, isFetching: isAuthorLoading }] =
        useLazyGetAuthorByAliasQuery();
    const [addAuthorToFavorite] = useAddAuthorToFavoriteMutation();
    const [likeAuthor] = useAddLikeToAuthorMutation();
    const [getSheets, { data: sheets }] = useLazyGetSheetsQuery();
    const [addSheet] = useAddSheetMutation();

    const sheetsList = sheets?.results || [];

    const isDark = useAppSelector(isDarkTheme);
    // const { user } = useAppSelector((state) => state);
    const isSuperUser = true; /**user.currentUser.is_superuser */

    const [logged] = useAuth();
    const { letter = '', authorAlias } = useParams<{ letter: string; authorAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [showSheetAddModal, setShowSheetAddModal] = React.useState<boolean>(false);
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authorAlias) {
            getAuthor({ alias: authorAlias });
            getSheets({ authorAlias });
            setPageNumber(1);
        }
    }, [location]);

    React.useEffect(() => {
        document.title = `${SiteName} - ${author?.name}`;
    }, [location, author]);

    const openSheetAddModal = () => setShowSheetAddModal(true);
    const closeSheetAddModal = () => setShowSheetAddModal(false);
    const closeEditModal = () => setShowEditModal(false);
    const openEditModal = () => setShowEditModal(true);

    const addSheetHandler = (options: AddSheetRequest) => {
        if (author?.id) {
            let formData = new FormData();
            formData.append('filename', options.filename);
            formData.append('name', options.sheetname);
            formData.append('author', author.id.toString());
            addSheet(options);
            closeSheetAddModal();
        }
    };

    const getSheetsByPage = (page: number) => {
        if (authorAlias) {
            getSheets({ authorAlias, page });
            setPageNumber(page);
        }
    };

    const editAuthorHandler = (options: EditAuthorByIdRequest) => {
        if (author?.id) {
            editAuthor({ ...options })
                .unwrap()
                .then(({ id, name, alias }) => {
                    if (id) {
                        navigate(Paths.getAuthorPath(name.charAt(0), alias));
                    }
                });
            closeEditModal();
        }
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
            caption: author?.name || '',
        },
    ];

    const goToGenre = (genreAlias: string) => {
        navigate(Paths.getGenrePage(genreAlias));
    };

    const swithFavoriteAuthor = () => {
        if (author?.id) {
            addAuthorToFavorite({
                authorId: author.id,
                isFavorite: !author.favorite,
            });
        }
    };

    const swithLikeAuthor = () => {
        if (author?.id) {
            likeAuthor({ authorId: author.id, hasLike: !author.like });
        }
    };

    const openDownloadPage = (sheet: SheetItemJsModel) => {
        if (authorAlias) {
            const path = Paths.getSheetDownloadPath(letter, authorAlias, sheet.id.toString());
            window.open(path, '_blank');
        }
    };

    return (
        <Page breadcrumbs={breadcrumbs} loading={isAuthorLoading}>
            <div className={styles.title}>
                <TextPlain className={styles.authorName}>{author?.name}</TextPlain>
                {logged && (
                    <div className={cn(styles.actions, isDark && styles.actions__dark)}>
                        {isSuperUser && (
                            <Button
                                className={styles.editBtn}
                                onClick={openEditModal}
                                disabled={isAuthorLoading}
                                icon={<EditIcon />}
                                use="link"
                            />
                        )}
                        <Button
                            className={cn(styles.likeBtn, author?.like && styles.likeBtn_active)}
                            onClick={swithLikeAuthor}
                            title={author?.like ? 'Убрать лайк' : 'Поставить лайк'}
                            disabled={isAuthorLoading}
                            use="link"
                        >
                            {author?.like_count}{' '}
                            <LikeIcon className={styles.likeIcon} active={author?.like} />
                        </Button>
                        <Button
                            className={cn(
                                styles.favoriteBtn,
                                author?.favorite && styles.favoriteBtn_active,
                                styles.favoriteBtn_showAlways,
                            )}
                            onClick={swithFavoriteAuthor}
                            title={
                                author?.favorite ? 'Убрать из избранных' : 'Добавить в избранное'
                            }
                            disabled={isAuthorLoading}
                            use="link"
                        >
                            <FavoriteIcon active={author?.favorite} />
                        </Button>
                    </div>
                )}
            </div>

            <div className={cn(styles.content, isDark && styles.content__dark)}>
                <div className={styles.description}>
                    <div>
                        <div className={styles.photo}>
                            <img
                                src={author?.preview}
                                alt={author?.name}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.genres}>
                            {author?.genres.map(({ name, id, alias }) => (
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
                    <TextPlain className={styles.authorInfo}>{author?.info}</TextPlain>
                </div>
                <TextPlain className={styles.sheetTitle}>НОТЫ</TextPlain>
                {sheets && sheets.page_count > 1 && (
                    <Pagination
                        pageNumber={pageNumber}
                        pageCount={sheets.page_count}
                        switchPage={getSheetsByPage}
                        size="small"
                    />
                )}
                <div className={styles.sheets}>
                    {sheetsList.length > 0 ? (
                        sheetsList.map((sheet, index) => (
                            <SheetRow
                                key={sheet.id}
                                sheet={sheet}
                                index={index}
                                onOpen={openDownloadPage}
                                type="second"
                                hidePosition
                            />
                        ))
                    ) : (
                        <TextPlain className={styles.notYetSheets}>
                            Тут скоро появятся ноты
                        </TextPlain>
                    )}
                    {sheets && sheets.page_count > 1 && (
                        <Pagination
                            pageNumber={pageNumber}
                            pageCount={sheets.page_count}
                            switchPage={getSheetsByPage}
                            size="small"
                        />
                    )}
                    {logged && (
                        <Button
                            onClick={openSheetAddModal}
                            icon={<AddIcon className={styles.addSheetIcon} />}
                            use="transparent"
                            className={styles.sheetItemAdd}
                        >
                            Добавить ноты
                        </Button>
                    )}
                </div>
            </div>
            {showSheetAddModal && author?.id && (
                <SheetAddModal
                    author={author}
                    closeModal={closeSheetAddModal}
                    addSheet={addSheetHandler}
                />
            )}
            {showEditModal && author?.id && (
                <AuthorEditModal
                    closeModal={closeEditModal}
                    editAuthor={editAuthorHandler}
                    author={author}
                />
            )}
        </Page>
    );
};
