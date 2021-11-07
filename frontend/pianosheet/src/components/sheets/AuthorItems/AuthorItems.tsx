import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { AuthorCardAdd, authorEditModel } from 'components/shared/AuthorCard/AuthorCardAdd';
import styles from './AuthorItems.scss';
import { Button } from 'components/shared/Button/Button';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { useAuth } from 'api/UsersClient';
import { Paths } from 'utils/routes/Paths';
import { useHistory } from 'react-router';

interface Props {
    authors: AuthorJsModel;
    pageNumber: number;
    addAuthor: (author: FormData) => Promise<AuthorItemJsModel | false>;
    getAuthorsByPage: (page: number) => void;
}

export const AuthorItems: React.FC<Props> = ({
    authors,
    pageNumber,
    addAuthor,
    getAuthorsByPage,
}) => {
    const [logged] = useAuth();
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const history = useHistory();

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const addAuthorHandler = (options: authorEditModel) => {
        let formData = new FormData();
        formData.append('preview', options.file);
        formData.append('name', options.author);
        formData.append('info', options.info);
        addAuthor(formData).then((res) => {
            closeModal();
            if (res) {
                history.push(Paths.getAuthorPath(res.alias.charAt(0), res.alias));
            }
        });
    };

    return (
        <div className={styles.root}>
            <div className={styles.items}>
                {authors.results.map(({ id, name, alias, preview_s }) => (
                    <AuthorCard
                        key={id + name}
                        authorName={name}
                        authorAlias={alias}
                        authorPreview={preview_s}
                        className={styles.item}
                    />
                ))}
                {logged && <Button className={styles.authorAddButton} onClick={openModal}></Button>}
            </div>
            {authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={getAuthorsByPage}
                />
            )}
            {showModal && <AuthorCardAdd closeModal={closeModal} addAuthor={addAuthorHandler} />}
        </div>
    );
};
