import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import { Modal } from 'components/shared/Modal/Modal';
import { AuthorItemJsModel } from 'domain/api/JsModels';
import { maxUploadPdfSize } from 'domain/SiteInfo';
import * as React from 'react';
import { AddSheetRequest } from 'redux/models/sheetModels';
import styles from './SheetAddModal.module.scss';

interface Props {
    author: AuthorItemJsModel;
    closeModal: () => void;
    addSheet: (options: AddSheetRequest) => void;
}

export const SheetAddModal: React.FC<Props> = ({ author, closeModal, addSheet }) => {
    const [form, setForm] = React.useState<AddSheetRequest>({
        sheetname: '',
        filename: '',
        authorId: author.id,
    });

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, sheetname: e.target.value });
    };

    const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setForm({ ...form, filename: e.target.files[0], sheetname: e.target.files[0].name });
    };

    const onSave = () => addSheet(form);

    return (
        <Modal
            title="Добавление нот"
            onClose={closeModal}
            bottomPanel={
                <>
                    <Button onClick={onSave}>Добавить</Button>
                    <Button use="link" onClick={closeModal}>
                        Отменить
                    </Button>
                </>
            }
        >
            <div className={styles.formItem}>
                <Input
                    placeholder="Название нот"
                    value={form.sheetname}
                    onChange={changeName}
                    minLength={4}
                    maxLength={40}
                    required
                />
            </div>
            <div className={styles.formItem}>
                <Input
                    placeholder="Файл"
                    type="file"
                    onChange={chooseFile}
                    accept=".pdf"
                    size={maxUploadPdfSize}
                    className={styles.fileInput}
                />
            </div>
        </Modal>
    );
};
