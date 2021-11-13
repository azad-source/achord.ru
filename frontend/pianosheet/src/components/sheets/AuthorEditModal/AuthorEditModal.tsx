import * as React from 'react';
import styles from './AuthorEditModal.module.scss';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';
import { Input } from 'components/shared/Input/Input';
import { Textarea } from 'components/shared/Textarea/Textarea';
import { maxAuthorDescriptionLength, maxUploadImageSize } from 'domain/SiteInfo';
import { AuthorItemJsModel, GenreResultJsModel } from 'domain/api/JsModels';
import cn from 'classnames';
import { useToast } from 'components/shared/Toast/Toast';
import { SheetsClient } from 'api/SheetsClient';

export type authorEditModel = {
    name: string;
    info: string;
    preview: any;
    genres: GenreResultJsModel[];
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
    const [allGenres, setAllGenres] = React.useState<GenreResultJsModel[]>([]);

    const { push } = useToast();

    React.useEffect(() => {
        if (allGenres.length < 1) SheetsClient.getGenres().then((r) => setAllGenres(r.results));
    }, []);

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

    const isGenreSelected = (genre: GenreResultJsModel) =>
        form.genres.some(({ id }) => id === genre.id);

    const handleSelectGenre = (genre: GenreResultJsModel) => {
        if (isGenreSelected(genre)) {
            setForm((prev) => ({
                ...prev,
                genres: prev.genres.filter(({ id }) => id !== genre.id),
            }));
            return;
        }
        setForm((prev) => ({ ...prev, genres: [...prev.genres, genre] }));
    };

    return (
        <Modal
            title="Редактирование автора"
            onClose={closeModal}
            bottomPanel={
                <>
                    <Button onClick={onSave}>Сохранить</Button>
                    <Button use="link" onClick={closeModal}>
                        Отменить
                    </Button>
                </>
            }
        >
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
                {allGenres.length > 0 &&
                    allGenres.map((genre) => {
                        return (
                            <div
                                key={genre.id}
                                className={cn(
                                    styles.genres_item,
                                    isGenreSelected(genre) && styles.genres_item__selected,
                                )}
                                onClick={() => handleSelectGenre(genre)}
                            >
                                {genre.name}
                            </div>
                        );
                    })}
            </div>
            <div className={styles.formItem}>
                <img className={styles.image} src={selectedImage || form.preview} />
                <Input
                    placeholder="Фото"
                    type="file"
                    onChange={chooseFile}
                    accept=".jpg, .jpeg, .png"
                    size={maxUploadImageSize}
                    className={styles.fileInput}
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
        </Modal>
    );
};
