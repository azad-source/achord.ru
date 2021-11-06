import { Input } from 'components/shared/Input/Input';
import { Modal } from 'components/shared/Modal/Modal';
import { Textarea } from 'components/shared/Textarea/Textarea';
import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { AuthorCard } from '../AuthorCard/AuthorCard';
import { AuthorCardAdd } from '../AuthorCard/AuthorCardAdd';
import cn from 'classnames';
import styles from './AuthorItems.scss';
import { Button } from 'components/shared/Button/Button';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { maxUploadImageSize } from 'domain/SiteInfo';
import { useAuth } from 'api/UsersClient';
import { Paths } from 'utils/routes/Paths';

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
    const [form, setForm] = React.useState<{
        author: string;
        file: any;
        info: string;
    }>({ author: '', file: '', info: '' });

    const closeModal = () => {
        setShowModal(false);
        setForm({ author: '', file: '', info: '' });
    };
    const openModal = () => setShowModal(true);
    const addAuthorHandler = (e: React.FormEvent) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('preview', form.file);
        formData.append('name', form.author);
        formData.append('info', form.info);
        addAuthor(formData).then((res) => {
            if (res) {
                window.location.href = Paths.getAuthorPath(
                    res.alias.charAt(0),
                    res.alias,
                );
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
                {logged && <AuthorCardAdd openModal={openModal} />}
                {showModal && (
                    <Modal
                        title="Добавление автора"
                        onClose={() => setShowModal(false)}
                    >
                        <form onSubmit={(e) => addAuthorHandler(e)}>
                            <Input
                                placeholder="Автор"
                                className={styles.formItem}
                                value={form.author}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({ ...form, author: e.target.value })
                                }
                                minLength={4}
                                maxLength={40}
                                required
                            />
                            <Input
                                placeholder="Фото"
                                type="file"
                                className={styles.formItem}
                                onChange={(e: any) =>
                                    setForm({
                                        ...form,
                                        file: e.target.files[0],
                                    })
                                }
                                accept=".jpg, .jpeg, .png"
                                size={maxUploadImageSize}
                            />
                            <Textarea
                                placeholder="Описание"
                                maxLength={1000}
                                rows={7}
                                cols={50}
                                className={cn(
                                    styles.formItem,
                                    styles.formItem_Textarea,
                                )}
                                value={form.info}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => setForm({ ...form, info: e.target.value })}
                            />
                            <div className={styles.buttonsWrapper}>
                                <Button>Добавить</Button>
                                <Button use="link" onClick={closeModal}>
                                    Отменить
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
            {authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={getAuthorsByPage}
                />
            )}
        </div>
    );
};
