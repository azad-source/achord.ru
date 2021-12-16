import { AuthorItemJsModel, AuthorJsModel, AuthorRequestModel } from 'domain/api/JsModels';
import * as React from 'react';
import { AuthorCard, AuthorCardAdd } from 'components/shared/AuthorCard/AuthorCard';
import { AuthorAddModal } from 'components/sheets/AuthorAddModal/AuthorAddModal';
import styles from './AuthorItems.scss';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { Paths } from 'utils/routes/Paths';
import { useHistory } from 'react-router';

interface Props {
    authors: AuthorJsModel;
    pageNumber: number;
    canAddAuthor: boolean;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
    getAuthorsByPage: (page: number) => void;
}

export const AuthorItems: React.FC<Props> = ({
    authors,
    pageNumber,
    canAddAuthor,
    addAuthor,
    getAuthorsByPage,
}) => {
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const history = useHistory();

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const addAuthorHandler = (options: AuthorRequestModel) => {
        let formData = new FormData();
        formData.append('preview', options.preview);
        formData.append('name', options.name);
        formData.append('info', options.info);
        formData.append('genres', JSON.stringify(options.genres.map(({ id }) => id)));
        addAuthor(formData).then((res) => {
            if (res) {
                history.push(Paths.getAuthorPath(res.name.charAt(0), res.alias));
            }
        });
        closeModal();
    };

    return (
        <>
            <div className={styles.authors}>
                {canAddAuthor && <AuthorCardAdd onClick={openModal} />}
                {authors.results.map((author, index) => (
                    <AuthorCard key={index} author={author} className={styles.authors_item} />
                ))}
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
