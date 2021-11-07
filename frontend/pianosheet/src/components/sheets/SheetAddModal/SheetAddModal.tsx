import { Button } from 'components/shared/Button/Button';
import { Input } from 'components/shared/Input/Input';
import { Modal } from 'components/shared/Modal/Modal';
import { maxUploadPdfSize } from 'domain/SiteInfo';
import * as React from 'react';
import styles from './SheetAddModal.module.scss';

export type sheetAddModel = {
    sheetname: string;
    filename: any;
};

interface Props {
    closeModal: () => void;
    addSheet: (options: sheetAddModel) => void;
}

export const SheetAddModal: React.FC<Props> = ({ closeModal, addSheet }) => {
    const [form, setForm] = React.useState<sheetAddModel>({ sheetname: '', filename: '' });

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, sheetname: e.target.value });
    };

    const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setForm({ ...form, filename: e.target.files[0] });
    };

    const onSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addSheet(form);
    };

    return (
        <Modal title="Добавление нот" onClose={closeModal}>
            <form onSubmit={onSave}>
                <Input
                    placeholder="Название нот"
                    className={styles.formItem}
                    value={form.sheetname}
                    onChange={changeName}
                    minLength={4}
                    maxLength={40}
                    required
                />
                <Input
                    placeholder="Файл"
                    type="file"
                    className={styles.formItem}
                    onChange={chooseFile}
                    accept=".pdf"
                    size={maxUploadPdfSize}
                />
                <div className={styles.buttonsWrapper}>
                    <Button onClick={() => addSheet(form)}>Добавить</Button>
                    <Button use="link" onClick={closeModal}>
                        Отменить
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
