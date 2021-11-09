import * as React from 'react';
import styles from './AuthorEditModal.module.scss';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';
import { Input } from 'components/shared/Input/Input';
import { Textarea } from 'components/shared/Textarea/Textarea';
import { maxAuthorDescriptionLength, maxUploadImageSize } from 'domain/SiteInfo';
import { AuthorItemJsModel } from 'domain/api/JsModels';
import { GenresMock } from 'mockData/allMocks';
import cn from 'classnames';
import { useToast } from 'components/shared/Toast/Toast';

export type authorEditModel = {
    name: string;
    info: string;
    preview: any;
    genres: string[];
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
        genres: [],
    });

    const [selectedImage, setSelectedImage] = React.useState<string | ArrayBuffer | null>('');

    const { push } = useToast();

    React.useEffect(() => {
        if (author)
            setForm({
                name: author.name,
                info: author.info || '',
                preview: author.preview,
                genres: author.genres,
            });
    }, [author]);

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, name: e.target.value });
    };

    const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setForm({ ...form, preview: file });

            if (FileReader && file) {
                var fileReader = new FileReader();
                fileReader.onloadend = function () {
                    setSelectedImage(fileReader.result);
                };
                fileReader.readAsDataURL(file);
            }
        }
    };

    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm({ ...form, info: e.target.value });
    };

    const onSave = () => {
        if (form.genres.length < 1) {
            push('Выберите хотябы один жанр');
            return;
        }
        editAuthor(form);
    };

    const isGenreSelected = (genre: string) => form.genres.includes(genre);

    const handleSelectGenre = (genre: string) => {
        if (isGenreSelected(genre)) {
            setForm((prev) => ({ ...prev, genres: prev.genres.filter((item) => item !== genre) }));
            return;
        }
        setForm((prev) => ({ ...prev, genres: [...prev.genres, genre] }));
    };

    return (
        <>
            <Modal title="Редактирование автора" onClose={closeModal}>
                <div className={styles.formItem}>
                    <Input
                        placeholder="Автор"
                        value={form.name}
                        onChange={changeName}
                        minLength={4}
                        maxLength={40}
                        required
                    />
                </div>
                <div className={cn(styles.formItem, styles.genres)}>
                    {GenresMock.map((genre) => {
                        return (
                            <div
                                key={genre}
                                className={cn(
                                    styles.genres_item,
                                    isGenreSelected(genre) && styles.genres_item__selected,
                                )}
                                onClick={() => handleSelectGenre(genre)}
                            >
                                {genre}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.formItem}>
                    <img src={selectedImage || form.preview} width={150} />
                    <Input
                        placeholder="Фото"
                        type="file"
                        onChange={chooseFile}
                        accept=".jpg, .jpeg, .png"
                        size={maxUploadImageSize}
                    />
                </div>
                <div className={styles.formItem}>
                    <Textarea
                        placeholder="Описание"
                        maxLength={maxAuthorDescriptionLength}
                        rows={5}
                        cols={50}
                        value={form.info}
                        onChange={changeDescription}
                    />
                </div>
                <div className={styles.buttonsWrapper}>
                    <Button onClick={onSave}>Сохранить</Button>
                    <Button use="link" onClick={closeModal}>
                        Отменить
                    </Button>
                </div>
            </Modal>
        </>
    );
};
