import * as React from 'react';
import styles from './AuthorCard.module.scss';
import cn from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import { AuthorEditModal } from 'components/sheets/AuthorEditModal/AuthorEditModal';
import { AuthorItemJsModel } from 'domain/api/JsModels';
import { RemoveModal } from '../RemoveModal/RemoveModal';
import { FavoriteIcon } from '../icons/FavoriteIcon';
import { Button } from '../Button/Button';
import { isDarkTheme } from 'redux/slices/appSlice';
import { useAppSelector } from 'redux/hooks';
import { Loader } from '../layout/Loader/Loader';
import {
    useAddAuthorToFavoriteMutation,
    useEditAuthorByIdMutation,
    useGetUserDataQuery,
    useRemoveAuthorByIdMutation,
} from 'redux/api';
import { EditAuthorByIdRequest } from 'redux/models/authorModels';
import { useAuth } from 'redux/apiConfig';

interface Props {
    author: AuthorItemJsModel;
    className?: string;
}

export const AuthorCard: React.FC<Props> = ({ author, className }) => {
    const { id, favorite } = author;

    const [editAuthorById, { isLoading: isEditLoading }] = useEditAuthorByIdMutation();

    const [addToFavorite, { isLoading: isAddToFavoriteLoading }] = useAddAuthorToFavoriteMutation();

    const [removeAuthorById, { isLoading: isRemoveLoading }] = useRemoveAuthorByIdMutation();

    const { data: currentUser, isLoading: isUserLoading } = useGetUserDataQuery();

    const isLoading = isEditLoading || isAddToFavoriteLoading || isRemoveLoading || isUserLoading;

    const navigate = useNavigate();

    const isSuperUser = currentUser?.is_superuser || false;

    const isDark = useAppSelector(isDarkTheme);

    const [logged] = useAuth();

    const handleEditAuthor = async (options: EditAuthorByIdRequest): Promise<void> => {
        const { alias, name } = await editAuthorById(options).unwrap();
        await navigate(Paths.getAuthorPath(name.charAt(0), alias));
    };

    const handleAddToFavorite = () => {
        addToFavorite({ authorId: id, isFavorite: !favorite });
    };

    const handleRemoveAuthor = () => {
        removeAuthorById({ id });
    };

    return (
        <AuthorCard_
            author={author}
            isLoading={isLoading}
            canEdit={isSuperUser}
            canAddToFavorite={!!logged}
            className={className}
            onEditAuthor={handleEditAuthor}
            onAddToFavorite={handleAddToFavorite}
            onRemoveAuthor={handleRemoveAuthor}
            isDarkTheme={isDark}
        />
    );
};

interface Props_ {
    author: AuthorItemJsModel;
    isLoading: boolean;
    canEdit: boolean;
    canAddToFavorite: boolean;
    isDarkTheme: boolean;
    className?: string;
    onEditAuthor: (options: EditAuthorByIdRequest) => Promise<void>;
    onAddToFavorite: () => void;
    onRemoveAuthor: () => void;
}

export const AuthorCard_: React.FC<Props_> = ({
    author,
    isLoading,
    canEdit,
    canAddToFavorite,
    isDarkTheme,
    className,
    onEditAuthor,
    onAddToFavorite,
    onRemoveAuthor,
}) => {
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    const [showRemoveModal, setShowRemoveModal] = React.useState<boolean>(false);
    const [showEditMenu, setShowEditMenu] = React.useState<boolean>(false);

    const { preview_s, alias, name, favorite } = author;
    const authorImage = preview_s || defaultImg;
    const authorPath = alias ? Paths.getAuthorPath(name.charAt(0), alias) : '';

    const hasPreview = preview_s && !preview_s.includes('default.png');

    const openEditMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowEditMenu((prev) => !prev);
    };

    const openEditModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowEditModal(true);
        setShowEditMenu(false);
    };

    const openRemoveModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowRemoveModal(true);
        setShowEditMenu(false);
    };

    const closeEditModal = () => setShowEditModal(false);
    const closeRemoveModal = () => setShowRemoveModal(false);
    const closeEditMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowEditMenu(false);
    };

    const handleEditAuthor = (options: EditAuthorByIdRequest) => {
        onEditAuthor(options).finally(closeEditModal);
    };

    const handleAddToFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onAddToFavorite();
        setShowEditMenu(false);
    };

    document.addEventListener('click', () => {
        if (showEditMenu) setShowEditMenu(false);
    });

    return (
        <Loader isLoading={isLoading} className={styles.wrapper}>
            <NavLink
                className={cn(styles.root, isDarkTheme && styles.root__dark, className)}
                to={authorPath}
            >
                {canEdit && (
                    <>
                        <span className={styles.edit} onClick={openEditMenu}>
                            <div className={styles.edit_icon}>
                                <span className={styles.edit_icon_dot} />
                                <span className={styles.edit_icon_dot} />
                                <span className={styles.edit_icon_dot} />
                            </div>
                        </span>
                        {showEditMenu && (
                            <div className={styles.editMenu}>
                                <div className={styles.editMenu_item} onClick={openEditModal}>
                                    Изменить
                                </div>
                                <div
                                    className={cn(
                                        styles.editMenu_item,
                                        styles.editMenu_item__remove,
                                    )}
                                    onClick={openRemoveModal}
                                >
                                    Удалить
                                </div>
                                <div className={styles.editMenu_item} onClick={closeEditMenu}>
                                    Отмена
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className={styles.img}>
                    {canAddToFavorite && (
                        <Button
                            className={cn(
                                styles.favoriteBtn,
                                favorite && styles.favoriteBtn_active,
                            )}
                            use="link"
                            onClick={handleAddToFavorite}
                            title={favorite ? 'Убрать из избранных' : 'Добавить в избранное'}
                            disabled={isLoading}
                        >
                            <FavoriteIcon active={favorite} />
                        </Button>
                    )}
                    <div
                        className={cn(styles.img_bg, !hasPreview && styles.img_bg__default)}
                        style={{ backgroundImage: 'url(' + authorImage + ')' }}
                    ></div>
                    {hasPreview && (
                        <img
                            src={authorImage}
                            alt={name}
                            title={name}
                            className={styles.img_main}
                        />
                    )}
                </div>
                <div className={styles.name} style={{ fontSize: 35 / Math.pow(name.length, 0.32) }}>
                    {name}
                </div>
            </NavLink>

            {showEditModal && (
                <AuthorEditModal
                    closeModal={closeEditModal}
                    editAuthor={handleEditAuthor}
                    author={author}
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    closeModal={closeRemoveModal}
                    onRemove={onRemoveAuthor}
                    title="Удаление автора"
                    text={`Вы уверены, что хотите удалить ${name}?`}
                />
            )}
        </Loader>
    );
};
