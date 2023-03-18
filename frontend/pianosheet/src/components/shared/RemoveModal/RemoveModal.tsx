import * as React from 'react';
import styles from './RemoveModal.module.scss';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';

interface Props {
    title: string;
    text: string;
    closeModal: () => void;
    onRemove: () => void;
}

export const RemoveModal: React.FC<Props> = ({ title, text, closeModal, onRemove }) => {
    const handleRemove = () => {
        onRemove();
        closeModal();
    };

    return (
        <Modal
            title={title}
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
