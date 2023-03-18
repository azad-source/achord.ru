import * as React from 'react';
import styles from './AuthorAddModal.module.scss';
import { Button } from 'components/shared/Button/Button';
import { Modal } from 'components/shared/Modal/Modal';
import { Input } from 'components/shared/Input/Input';
import { Textarea } from 'components/shared/Textarea/Textarea';
import { maxAuthorDescriptionLength, maxUploadImageSize } from 'domain/SiteInfo';
import { defaultAuthorRequestModel, GenreItemJsModel } from 'domain/api/JsModels';
import cn from 'classnames';
import { useToast } from 'components/shared/Toast/Toast';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';
import { AddAuthorRequest } from 'redux/models/authorModels';
import { useGetGenresQuery } from 'redux/api/genreApi';

interface Props {
    closeModal: () => void;
    addAuthor: (options: AddAuthorRequest) => void;
}

export const AuthorAddModal: React.FC<Props> = ({ closeModal, addAuthor }) => {
    const { data: genres } = useGetGenresQuery({ page: 1 });
    const genresList = genres?.results || [];

    const [form, setForm] = React.useState<AddAuthorRequest>(defaultAuthorRequestModel);
    const [tempImage, setTempImage] = React.useState<string | ArrayBuffer | null>('');
    const isDark = useAppSelector(isDarkTheme);

    const { push } = useToast();

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
                    setTempImage(fileReader.result);
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
        addAuthor(form);
    };

    const isGenreSelected = (genre: GenreItemJsModel) =>
        form.genres.some(({ id }) => id === genre.id);

    const handleSelectGenre = (genre: GenreItemJsModel) => {
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
            title="Добавление автора"
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
                    placeholder="Автор"
                    value={form.name}
                    onChange={changeName}
                    minLength={4}
                    maxLength={40}
                    required
                />
            </div>
            <div className={cn(styles.formItem, styles.genres, isDark && styles.genres__dark)}>
                {genresList.map((genre) => (
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
                ))}
            </div>
            <div className={styles.formItem}>
                <img src={tempImage || form.preview} className={styles.image} />
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
                    rows={7}
                    cols={50}
                    value={form.info}
                    onChange={changeDescription}
                />
            </div>
        </Modal>
    );
};
