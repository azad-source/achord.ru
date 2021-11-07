import * as React from 'react';
import styles from './AuthorEditModal.module.scss';
import cn from 'classnames';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';
import { Input } from 'components/shared/Input/Input';
import { Textarea } from 'components/shared/Textarea/Textarea';
import { maxUploadImageSize } from 'domain/SiteInfo';
import { AuthorItemJsModel } from 'domain/api/JsModels';

export type authorEditModel = {
    name: string;
    info: string;
    preview: any;
};

interface Props {
    author: AuthorItemJsModel;
    closeModal: () => void;
    editAuthor: (options: authorEditModel) => void;
}

export const AuthorEditModal: React.FC<Props> = ({ author, closeModal, editAuthor }) => {
    const [form, setForm] = React.useState<authorEditModel>({
        name: '',
        info: '',
        preview: '',
    });

    React.useEffect(() => {
        if (author)
            setForm({
                name: author.name,
                info: author.info || '',
                preview: author.preview,
            });
    }, [author]);

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, name: e.target.value });
    };

    const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setForm({ ...form, preview: e.target.files[0] });
    };

    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm({ ...form, info: e.target.value });
    };

    const onSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editAuthor(form);
    };

    return (
        <Modal title="Добавление автора" onClose={closeModal}>
            <form onSubmit={onSave}>
                <Input
                    placeholder="Автор"
                    className={styles.formItem}
                    value={form.name}
                    onChange={changeName}
                    minLength={4}
                    maxLength={40}
                    required
                />
                <Input
                    placeholder="Фото"
                    type="file"
                    className={styles.formItem}
                    onChange={chooseFile}
                    accept=".jpg, .jpeg, .png"
                    size={maxUploadImageSize}
                />
                <Textarea
                    placeholder="Описание"
                    maxLength={1000}
                    rows={7}
                    cols={50}
                    className={cn(styles.formItem, styles.formItem_Textarea)}
                    value={form.info}
                    onChange={changeDescription}
                />
                <div className={styles.buttonsWrapper}>
                    <Button onClick={() => editAuthor(form)}>Сохранить</Button>
                    <Button use="link" onClick={closeModal}>
                        Отменить
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
