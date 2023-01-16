import * as React from 'react';
import styles from './AuthorPage.scss';
import cn from 'classnames';
import { Page } from 'components/shared/layout/Page/Page';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthorRequestModel, SheetItemJsModel } from 'domain/api/JsModels';
import { AddIcon } from 'components/shared/icons/AddIcon';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { Paths } from 'utils/routes/Paths';
import { SheetAddModal, sheetAddModel } from '../SheetAddModal/SheetAddModal';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { AuthorEditModal } from '../AuthorEditModal/AuthorEditModal';
import { Button } from 'components/shared/Button/Button';
import { EditIcon } from 'components/shared/icons/EditIcon';
import { SiteName } from 'domain/SiteInfo';
import { FavoriteIcon } from 'components/shared/icons/FavoriteIcon';
import { LikeIcon } from 'components/shared/icons/LikeIcon';
import { SheetRow } from 'components/shared/SheetRow/SheetRow';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';
import { useAuth } from 'redux/api/UserClient';
import { addAuthorToFavorite, editAuthor, getAuthor, likeAuthor } from 'redux/slices/author';
import { addSheet, addSheetToFavorite, getSheets } from 'redux/slices/sheet';

export const AuthorPage = () => {
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(isDarkTheme);
    const { author, user, sheet } = useAppSelector((state) => state);
    const { current: currentAuthor, status } = author;
    const { list: sheets } = sheet;
    const isSuperUser = user.currentUser.is_superuser;

    const [logged] = useAuth();
    const { letter = '', authorAlias } = useParams<{ letter: string; authorAlias: string }>();
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [showSheetAddModal, setShowSheetAddModal] = React.useState<boolean>(false);
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authorAlias) {
            dispatch(getAuthor(authorAlias));
            setPageNumber(1);
        }
    }, [location]);

    React.useEffect(() => {
        document.title = `${SiteName} - ${currentAuthor?.name}`;
    }, [location, currentAuthor]);

    const openSheetAddModal = () => setShowSheetAddModal(true);
    const closeSheetAddModal = () => setShowSheetAddModal(false);
    const closeEditModal = () => setShowEditModal(false);
    const openEditModal = () => setShowEditModal(true);

    const addSheetHandler = (options: sheetAddModel) => {
        if (currentAuthor?.id) {
            let formData = new FormData();
            formData.append('filename', options.filename);
            formData.append('name', options.sheetname);
            formData.append('author', currentAuthor.id.toString());
            dispatch(addSheet(formData));
            closeSheetAddModal();
        }
    };

    const getSheetsByPage = (page: number) => {
        if (authorAlias) {
            dispatch(getSheets({ author_alias: authorAlias, page }));
            setPageNumber(page);
        }
    };

    const editAuthorHandler = (options: AuthorRequestModel) => {
        if (currentAuthor?.id) {
            let formData = new FormData();
            if (options.preview !== currentAuthor.preview)
                formData.append('preview', options.preview);
            if (options.name !== currentAuthor.name) formData.append('name', options.name);
            if (options.info !== currentAuthor.info) formData.append('info', options.info);
            if (options.genres !== currentAuthor.genres)
                formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
            dispatch(editAuthor({ authorId: currentAuthor.id, author: formData }))
                .unwrap()
                .then(({ author }) => {
                    if (author.id) {
                        navigate(Paths.getAuthorPath(author.name.charAt(0), author.alias));
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
            caption: currentAuthor?.name || '',
        },
    ];

    const goToGenre = (genreAlias: string) => {
        navigate(Paths.getGenrePage(genreAlias));
    };

    const swithFavoriteAuthor = () => {
        if (currentAuthor?.id) {
            dispatch(
                addAuthorToFavorite({
                    authorId: currentAuthor.id,
                    isFavorite: !currentAuthor.favorite,
                }),
            );
        }
    };

    const swithLikeAuthor = () => {
        if (currentAuthor?.id) {
            dispatch(likeAuthor({ authorId: currentAuthor.id, hasLike: !currentAuthor.like }));
        }
    };

    const openDownloadPage = (sheet: SheetItemJsModel) => {
        if (authorAlias) {
            const path = Paths.getSheetDownloadPath(letter, authorAlias, sheet.id.toString());
            window.open(path, '_blank');
        }
    };

    const addSheetToFavHandler = (sheetId: number, isFavorite: boolean) => {
        return dispatch(addSheetToFavorite({ sheetId, isFavorite })).unwrap();
    };

    return (
        <Page breadcrumbs={breadcrumbs} loading={status.isRequest()}>
            <div className={styles.title}>
                <TextPlain className={styles.authorName}>{currentAuthor?.name}</TextPlain>
                {logged && (
                    <div className={cn(styles.actions, isDark && styles.actions__dark)}>
                        {isSuperUser && (
                            <Button
                                className={styles.editBtn}
                                onClick={openEditModal}
                                disabled={status.isRequest()}
                                icon={<EditIcon />}
                                use="link"
                            />
                        )}
                        <Button
                            className={cn(
                                styles.likeBtn,
                                currentAuthor?.like && styles.likeBtn_active,
                            )}
                            onClick={swithLikeAuthor}
                            title={currentAuthor?.like ? 'Убрать лайк' : 'Поставить лайк'}
                            disabled={status.isRequest()}
                            use="link"
                        >
                            {currentAuthor?.like_count}{' '}
                            <LikeIcon className={styles.likeIcon} active={currentAuthor?.like} />
                        </Button>
                        <Button
                            className={cn(
                                styles.favoriteBtn,
                                currentAuthor?.favorite && styles.favoriteBtn_active,
                                styles.favoriteBtn_showAlways,
                            )}
                            onClick={swithFavoriteAuthor}
                            title={
                                currentAuthor?.favorite
                                    ? 'Убрать из избранных'
                                    : 'Добавить в избранное'
                            }
                            disabled={status.isRequest()}
                            use="link"
                        >
                            <FavoriteIcon active={currentAuthor?.favorite} />
                        </Button>
                    </div>
                )}
            </div>

            <div className={cn(styles.content, isDark && styles.content__dark)}>
                <div className={styles.description}>
                    <div>
                        <div className={styles.photo}>
                            <img
                                src={currentAuthor?.preview}
                                alt={currentAuthor?.name}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.genres}>
                            {currentAuthor?.genres.map(({ name, id, alias }) => (
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
                    <TextPlain className={styles.authorInfo}>{currentAuthor?.info}</TextPlain>
                </div>
                <TextPlain className={styles.sheetTitle}>НОТЫ</TextPlain>
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
                        sheets.results.map((sheet, index) => (
                            <SheetRow
                                key={sheet.id}
                                sheet={sheet}
                                index={index}
                                onOpen={openDownloadPage}
                                addToFavorite={logged ? addSheetToFavHandler : undefined}
                                type="second"
                                hidePosition
                            />
                        ))
                    ) : (
                        <TextPlain className={styles.notYetSheets}>
                            Тут скоро появятся ноты
                        </TextPlain>
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
            {showSheetAddModal && (
                <SheetAddModal closeModal={closeSheetAddModal} addSheet={addSheetHandler} />
            )}
            {showEditModal && currentAuthor?.id && (
                <AuthorEditModal
                    closeModal={closeEditModal}
                    editAuthor={editAuthorHandler}
                    author={currentAuthor}
                />
            )}
        </Page>
    );
};
