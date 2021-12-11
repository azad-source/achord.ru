import * as React from 'react';
import styles from './AuthorCard.scss';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import { AuthorEditModal } from 'components/sheets/AuthorEditModal/AuthorEditModal';
import { AuthorItemJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import { RemoveModal } from '../RemoveModal/RemoveModal';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { useAuth } from 'api/UsersClient';

interface Props {
    className?: string;
    author: AuthorItemJsModel;
    index?: number;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
}

const AuthorCardFC: React.FC<Props> = ({ className, author, index, editAuthor, removeAuthor }) => {
    const [logged] = useAuth();
    const history = useHistory();
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    const [showRemoveModal, setShowRemoveModal] = React.useState<boolean>(false);
    const [showEditMenu, setShowEditMenu] = React.useState<boolean>(false);

    const { id, preview, alias, name } = author;
    const authorImage = preview || defaultImg;
    const path = alias ? Paths.getAuthorPath(author.name.charAt(0), alias) : '';

    const openEditMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditMenu((prev) => !prev);

        setTimeout(() => {
            if (!showEditMenu) setShowEditMenu(false);
        }, 4000);
    };

    const openEditModal = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setShowEditModal(true);
        setShowEditMenu(false);
    };

    const openRemoveModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowRemoveModal(true);
        setShowEditMenu(false);
    };

    const closeEditModal = () => setShowEditModal(false);
    const closeRemoveModal = () => setShowRemoveModal(false);
    const closeEditMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditMenu(false);
    };

    const goToAuthorPage = () => history.push(path);

    const editAuthorHandler = (options: AuthorRequestModel) => {
        let formData = new FormData();
        if (options.preview !== author.preview) formData.append('preview', options.preview);
        if (options.name !== author.name) formData.append('name', options.name);
        if (options.info !== author.info) formData.append('info', options.info);
        if (options.genres !== author.genres)
            formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
        editAuthor(id, formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.name.charAt(0), res.alias));
            }
        });
        closeEditModal();
    };

    const handleRemove = () => {
        removeAuthor(author.id);
    };

    return (
        <>
            <div className={cn(styles.root, className)} onClick={goToAuthorPage}>
                {logged && (
                    <>
                        <span className={styles.edit} onClick={openEditMenu}>
                            <div className={styles.edit_icon}>
                                {[...Array(3)].map((i) => (
                                    <span key={i} className={styles.edit_icon_dot} />
                                ))}
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
                    <div
                        className={cn(styles.img_bg, !preview && styles.img_bg__default)}
                        style={{ backgroundImage: 'url(' + authorImage + ')' }}
                    ></div>
                    {!!preview && (
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
            </div>

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

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            editAuthor: sheetsAction.editAuthor,
            removeAuthor: sheetsAction.removeAuthor,
        },
        dispatch,
    );
};

export const AuthorCard = connect(null, mapDispatchToProps)(AuthorCardFC);

interface AddProps {
    onClick: () => void;
}

export const AuthorCardAdd: React.FC<AddProps> = ({ onClick }) => {
    return <div className={cn(styles.root, styles.root_add)} onClick={onClick}></div>;
};
