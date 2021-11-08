import * as React from 'react';
import styles from './AuthorCard.scss';
import cn from 'classnames';
import { useHistory, useParams } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import { EditIcon } from '../icons/EditIcon';
import {
    AuthorEditModal,
    authorEditModel,
} from 'components/sheets/AuthorEditModal/AuthorEditModal';
import { AuthorItemJsModel } from 'domain/api/JsModels';

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

    const history = useHistory();

    const curLetter = firstAuthorletter ? firstAuthorletter : letter;

    const { id, preview, alias, name } = author;

    const backgroundImage = preview ? 'url(' + preview + ')' : 'url(' + defaultImg + ')';

    const path = alias ? Paths.getAuthorPath(curLetter, alias) : '';

    const openEditModal = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    const closeEditModal = () => setShowEditModal(false);

    const goToAuthorPage = () => history.push(path);

    const handleSave = (options: authorEditModel) => {
        let formData = new FormData();
        if (options.preview !== author.preview) formData.append('preview', options.preview);
        if (options.name !== author.name) formData.append('name', options.name);
        if (options.info !== author.info) formData.append('info', options.info);
        editAuthor(id, formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.alias.charAt(0), res.alias));
            }
        });
        closeEditModal();
    };

    return (
        <>
            <div
                className={cn(styles.root, className)}
                style={{ backgroundImage: backgroundImage }}
                onClick={goToAuthorPage}
            >
                {editable && (
                    <span className={styles.edit} onClick={openEditModal}>
                        <EditIcon />
                    </span>
                )}
                {index && <div className={styles.index}>{index}</div>}
                <div className={styles.authorName}>{name}</div>
            </div>

            {showEditModal && (
                <AuthorEditModal
                    closeModal={closeEditModal}
                    editAuthor={handleSave}
                    author={author}
                />
            )}
        </>
    );
};

interface AddProps {
    onClick: () => void;
}

export const AuthorCardAdd: React.FC<AddProps> = ({ onClick }) => {
    return <div className={styles.authorAddButton} onClick={onClick}></div>;
};
