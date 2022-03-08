import * as React from 'react';
import styles from './AuthorCard.scss';
import cn from 'classnames';
import { NavLink, useHistory } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import { AuthorEditModal } from 'components/sheets/AuthorEditModal/AuthorEditModal';
import { AuthorItemJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import { RemoveModal } from '../RemoveModal/RemoveModal';
import { FavoriteIcon } from '../icons/FavoriteIcon';
import { Button } from '../Button/Button';

interface Props {
    className?: string;
    author: AuthorItemJsModel;
    editAuthor?: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor?: (authorId: number) => void;
    addAuthorToFavorite?: (authorId: number, isFavorite: boolean) => void;
}

export const AuthorCard: React.FC<Props> = ({
    className,
    author,
    editAuthor,
    removeAuthor,
    addAuthorToFavorite,
}) => {
    const history = useHistory();
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    const [showRemoveModal, setShowRemoveModal] = React.useState<boolean>(false);
    const [showEditMenu, setShowEditMenu] = React.useState<boolean>(false);

    const { id, preview, alias, name, favorite } = author;
    const authorImage = preview || defaultImg;
    const authorPath = alias ? Paths.getAuthorPath(author.name.charAt(0), alias) : '';

    const hasPreview = preview && !preview.includes('default.png');

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

    const editAuthorHandler = (options: AuthorRequestModel) => {
        let formData = new FormData();
        if (options.preview !== author.preview) formData.append('preview', options.preview);
        if (options.name !== author.name) formData.append('name', options.name);
        if (options.info !== author.info) formData.append('info', options.info);
        if (options.genres !== author.genres)
            formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));

        if (editAuthor) {
            editAuthor(id, formData).then((res) => {
                if (res) {
                    history.push(Paths.getAuthorPath(res.name.charAt(0), res.alias));
                }
            });
        }

        closeEditModal();
    };

    const handleRemove = () => {
        if (removeAuthor) {
            removeAuthor(author.id);
        }
    };

    const addToFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (addAuthorToFavorite) {
            addAuthorToFavorite(id, !favorite);
        }
        setShowEditMenu(false);
    };

    document.addEventListener('click', () => {
        if (showEditMenu) setShowEditMenu(false);
    });

    const menuEnable = !!editAuthor || !!removeAuthor;

    return (
        <>
            <NavLink className={cn(styles.root, className)} to={authorPath}>
                {!!addAuthorToFavorite && (
                    <>
                        {menuEnable && (
                            <span className={styles.edit} onClick={openEditMenu}>
                                <div className={styles.edit_icon}>
                                    <span className={styles.edit_icon_dot} />
                                    <span className={styles.edit_icon_dot} />
                                    <span className={styles.edit_icon_dot} />
                                </div>
                            </span>
                        )}
                        {showEditMenu && (
                            <div className={styles.editMenu}>
                                {!!editAuthor && (
                                    <div className={styles.editMenu_item} onClick={openEditModal}>
                                        Изменить
                                    </div>
                                )}
                                {!!removeAuthor && (
                                    <div
                                        className={cn(
                                            styles.editMenu_item,
                                            styles.editMenu_item__remove,
                                        )}
                                        onClick={openRemoveModal}
                                    >
                                        Удалить
                                    </div>
                                )}
                                {menuEnable && (
                                    <div className={styles.editMenu_item} onClick={closeEditMenu}>
                                        Отмена
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                <div className={styles.img}>
                    {!!addAuthorToFavorite && (
                        <Button
                            className={cn(
                                styles.favoriteBtn,
                                favorite && styles.favoriteBtn_active,
                            )}
                            use="link"
                            onClick={addToFavorite}
                            title={favorite ? 'Убрать из избранных' : 'Добавить в избранное'}
                            disabled={false}
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
                            alt={author.name}
                            title={author.name}
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
                    editAuthor={editAuthorHandler}
                    author={author}
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    closeModal={closeRemoveModal}
                    onRemove={handleRemove}
                    title="Удаление автора"
                    text={`Вы уверены, что хотите удалить ${author.name}?`}
                />
            )}
        </>
    );
};
