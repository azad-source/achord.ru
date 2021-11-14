import * as React from 'react';
import styles from './RemoveModal.module.scss';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';
import { useToast } from 'components/shared/Toast/Toast';

interface Props {
    text: string;
    closeModal: () => void;
    onRemove: () => void;
}

export const RemoveModal: React.FC<Props> = ({ text, closeModal, onRemove }) => {
    const { push } = useToast();

    const handleRemove = () => {
        onRemove();
        closeModal();
    };

    return (
        <Modal
            title="Редактирование автора"
            onClose={closeModal}
            bottomPanel={
                <>
                    <Button onClick={handleRemove}>Да</Button>
                    <Button use="link" onClick={closeModal}>
                        Нет
                    </Button>
                </>
            }
            className={styles.root}
        >
            <div className={styles.text}>{text}</div>
        </Modal>
    );
};
