import * as React from 'react';
import styles from './AuthorCard.scss';
import cn from 'classnames';
import { NavLink, useHistory } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import { AuthorEditModal } from 'components/sheets/AuthorEditModal/AuthorEditModal';
import { AuthorItemJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import { RemoveModal } from '../RemoveModal/RemoveModal';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { RootState } from 'store/rootReducer';

interface Props {
    className?: string;
    author: AuthorItemJsModel;
    isSuperUser?: boolean;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
}

const AuthorCardFC: React.FC<Props> = ({
    className,
    author,
    isSuperUser = false,
    editAuthor,
    removeAuthor,
}) => {
    const history = useHistory();
    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    const [showRemoveModal, setShowRemoveModal] = React.useState<boolean>(false);
    const [showEditMenu, setShowEditMenu] = React.useState<boolean>(false);

    const { id, preview, alias, name } = author;
    const authorImage = preview || defaultImg;
    const authorPath = alias ? Paths.getAuthorPath(author.name.charAt(0), alias) : '';

    const hasPreview = preview && !preview.includes('default.png');

    const openEditMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowEditMenu((prev) => !prev);

        setTimeout(() => {
            if (!showEditMenu) setShowEditMenu(false);
        }, 4000);
    };

    const openEditModal = (e: React.MouseEvent<HTMLSpanElement>) => {
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
            <NavLink className={cn(styles.root, className)} to={authorPath}>
                {isSuperUser && (
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

const mapStateToProps = (state: RootState) => {
    return {
        isSuperUser: state.users.currentUser.is_superuser,
    };
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

export const AuthorCard = connect(mapStateToProps, mapDispatchToProps)(AuthorCardFC);
