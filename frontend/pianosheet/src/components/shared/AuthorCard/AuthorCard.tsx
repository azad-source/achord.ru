import * as React from 'react';
import styles from './AuthorCard.scss';
import cn from 'classnames';
import { useHistory, useParams } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import {
    AuthorEditModal,
    authorEditModel,
} from 'components/sheets/AuthorEditModal/AuthorEditModal';
import { AuthorItemJsModel } from 'domain/api/JsModels';
import { MenuButtonIcon } from '../icons/MenuButtonIcon';
import { RemoveModal } from '../RemoveModal/RemoveModal';

interface Props {
    className?: string;
    author: AuthorItemJsModel;
    firstAuthorletter?: string;
    index?: number;
    editable?: boolean;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
}

export const AuthorCard: React.FC<Props> = ({
    className,
    author,
    firstAuthorletter,
    index,
    editable = false,
    editAuthor,
}) => {
    const { letter, composerName } = useParams<{ letter: string; composerName: string }>();

    const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
    const [showRemoveModal, setShowRemoveModal] = React.useState<boolean>(false);
    const [showEditMenu, setShowEditMenu] = React.useState<boolean>(false);

    const history = useHistory();

    const curLetter = firstAuthorletter ? firstAuthorletter : letter;

    const { id, preview, alias, name } = author;

    const backgroundImage = preview ? 'url(' + preview + ')' : 'url(' + defaultImg + ')';

    const path = alias ? Paths.getAuthorPath(curLetter, alias) : '';

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

    const handleSave = (options: authorEditModel) => {
        let formData = new FormData();
        if (options.preview !== author.preview) formData.append('preview', options.preview);
        if (options.name !== author.name) formData.append('name', options.name);
        if (options.info !== author.info) formData.append('info', options.info);
        if (options.genres !== author.genres)
            formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
        editAuthor(id, formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.alias.charAt(0), res.alias));
            }
        });
        closeEditModal();
    };

    const handleRemove = () => {
        console.log('удаление автора');
    };

    return (
        <>
            <div className={cn(styles.root, className)} onClick={goToAuthorPage}>
                <div className={styles.top}>
                    {index && <div className={styles.top_index}>{index}</div>}
                    {editable && (
                        <>
                            <span className={styles.top_edit} onClick={openEditMenu}>
                                <MenuButtonIcon className={styles.top_edit_icon} />
                            </span>
                            {showEditMenu && (
                                <div className={styles.top_editMenu}>
                                    <div
                                        className={styles.top_editMenu_item}
                                        onClick={openEditModal}
                                    >
                                        Изменить
                                    </div>
                                    <div
                                        className={cn(
                                            styles.top_editMenu_item,
                                            styles.top_editMenu_item__remove,
                                        )}
                                        onClick={openRemoveModal}
                                    >
                                        Удалить
                                    </div>
                                    <div
                                        className={styles.top_editMenu_item}
                                        onClick={closeEditMenu}
                                    >
                                        Отмена
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className={styles.middle} style={{ backgroundImage: backgroundImage }}></div>
                <div
                    className={styles.bottom}
                    style={{ fontSize: 35 / Math.pow(name.length, 0.3) }}
                >
                    {name}
                </div>
            </div>

            {showEditModal && (
                <AuthorEditModal
                    closeModal={closeEditModal}
                    editAuthor={handleSave}
                    author={author}
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    closeModal={closeRemoveModal}
                    onRemove={handleRemove}
                    text={`Вы уверены, что хотите удалить ${author.name}?`}
                />
            )}
        </>
    );
};

interface AddProps {
    onClick: () => void;
}

export const AuthorCardAdd: React.FC<AddProps> = ({ onClick }) => {
    return <div className={cn(styles.root, styles.root_add)} onClick={onClick}></div>;
};
