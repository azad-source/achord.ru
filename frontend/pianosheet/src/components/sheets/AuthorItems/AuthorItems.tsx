import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { AuthorCard, AuthorCardAdd } from 'components/shared/AuthorCard/AuthorCard';
import { AuthorAddModal, authorAddModel } from 'components/sheets/AuthorAddModal/AuthorAddModal';
import styles from './AuthorItems.scss';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useAuth } from 'api/UsersClient';
import { Paths } from 'utils/routes/Paths';
import { useHistory } from 'react-router';

interface Props {
    authors: AuthorJsModel;
    pageNumber: number;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
    getAuthorsByPage: (page: number) => void;
    editAuthor: (authorId: number, author: FormData) => Promise<AuthorItemJsModel | false>;
    removeAuthor: (authorId: number) => void;
}

export const AuthorItems: React.FC<Props> = ({
    authors,
    pageNumber,
    addAuthor,
    getAuthorsByPage,
    editAuthor,
    removeAuthor,
}) => {
    const [logged] = useAuth();
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const history = useHistory();

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const addAuthorHandler = (options: authorAddModel) => {
        let formData = new FormData();
        formData.append('preview', options.file);
        formData.append('name', options.author);
        formData.append('info', options.info);
        addAuthor(formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.alias.charAt(0), res.alias));
            }
        });
        closeModal();
    };

    return (
        <>
            <div className={styles.authors}>
                {authors.results.map((author) => (
                    <AuthorCard
                        key={author.id}
                        author={author}
                        className={styles.authors_item}
                        editable={logged}
                        editAuthor={editAuthor}
                        removeAuthor={removeAuthor}
                    />
                ))}
                {logged && <AuthorCardAdd onClick={openModal} />}
            </div>
            {authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={getAuthorsByPage}
                />
            )}
            {showModal && <AuthorAddModal closeModal={closeModal} addAuthor={addAuthorHandler} />}
        </>
    );
};
