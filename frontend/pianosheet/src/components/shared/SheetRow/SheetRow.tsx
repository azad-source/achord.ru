import { SheetItemJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { Button } from '../Button/Button';
import styles from './SheetRow.scss';
import cn from 'classnames';
import { FavoriteIcon } from '../icons/FavoriteIcon';
import { QueryStatus } from 'domain/QueryStatus';

interface Props {
    sheet: SheetItemJsModel;
    index: number;
    status?: QueryStatus;
    onOpen: (sheet: SheetItemJsModel) => void;
    addToFavorite?: (sheetId: number, isFavorite: boolean) => void;
}

export const SheetRow: React.FC<Props> = ({
    sheet,
    index,
    status = QueryStatus.initial(),
    onOpen,
    addToFavorite,
}) => {
    const style = {
        background: `rgba(61, 68, 107, ${(11 - Math.ceil((index + 1) / 2)) / 10})`,
    };

    const { id, favorite } = sheet;

    const handleAddToFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (addToFavorite) {
            addToFavorite(id, !favorite);
        }
    };

    return (
        <div className={styles.root} onClick={() => onOpen(sheet)} style={style}>
            <div className={styles.caption}>
                {index + 1}. {sheet.name}
            </div>
            {!!addToFavorite && (
                <Button
                    className={cn(styles.favoriteBtn, favorite && styles.favoriteBtn_active)}
                    use="link"
                    onClick={handleAddToFavorite}
                    title={favorite ? 'Убрать из избранных' : 'Добавить в избранное'}
                    disabled={status.isRequest()}
                >
                    <FavoriteIcon active={favorite} />
                </Button>
            )}
        </div>
    );
};
