import * as React from 'react';
import styles from './AuthorAddModal.module.scss';
import cn from 'classnames';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';
import { Input } from 'components/shared/Input/Input';
import { Textarea } from 'components/shared/Textarea/Textarea';
import { maxUploadImageSize } from 'domain/SiteInfo';

export type authorAddModel = {
    author: string;
    file: any;
    info: string;
};

interface Props {
    closeModal: () => void;
    addAuthor: (options: authorAddModel) => void;
}

export const AuthorAddModal: React.FC<Props> = ({ closeModal, addAuthor }) => {
    const [form, setForm] = React.useState<authorAddModel>({ author: '', file: '', info: '' });
    const [tempImage, setTempImage] = React.useState<string | ArrayBuffer | null>('');

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, author: e.target.value });
    };

    const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setForm({ ...form, file });

            if (FileReader && file) {
                var fileReader = new FileReader();
                fileReader.onloadend = function () {
                    setTempImage(fileReader.result);
                };
                fileReader.readAsDataURL(file);
            }
        }
    };

    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm({ ...form, info: e.target.value });
    };

    const onSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addAuthor(form);
    };

    return (
        <Modal title="Добавление автора" onClose={closeModal}>
            <form onSubmit={onSave}>
                <Input
                    placeholder="Автор"
                    className={styles.formItem}
                    value={form.author}
                    onChange={changeName}
                    minLength={4}
                    maxLength={40}
                    required
                />
                <div className={styles.formItem}>
                    <img src={tempImage || form.file} width={150} />
                    <Input
                        placeholder="Фото"
                        type="file"
                        onChange={chooseFile}
                        accept=".jpg, .jpeg, .png"
                        size={maxUploadImageSize}
                    />
                </div>
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
                    <Button onClick={() => addAuthor(form)}>Добавить</Button>
                    <Button use="link" onClick={closeModal}>
                        Отменить
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
