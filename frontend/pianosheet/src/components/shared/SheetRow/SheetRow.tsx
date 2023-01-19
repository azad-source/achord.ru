import { SheetItemJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { Button } from '../Button/Button';
import styles from './SheetRow.module.scss';
import cn from 'classnames';
import { FavoriteIcon } from '../icons/FavoriteIcon';
import { QueryStatus } from 'domain/QueryStatus';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/app';

type SheetRowType = 'main' | 'second';

interface Props {
    sheet: SheetItemJsModel;
    index: number;
    status?: QueryStatus;
    type?: SheetRowType;
    hidePosition?: boolean;
    onOpen: (sheet: SheetItemJsModel) => void;
    addToFavorite?: (sheetId: number, isFavorite: boolean) => void;
}

export const SheetRow: React.FC<Props> = ({
    sheet,
    index,
    status = QueryStatus.initial(),
    type = 'main',
    hidePosition = false,
    onOpen,
    addToFavorite,
}) => {
    const isDark = useAppSelector(isDarkTheme);

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
        <div
            className={cn(styles.root, styles[`root_${type}`], isDark && styles.root__dark)}
            onClick={() => onOpen(sheet)}
            style={type === 'main' ? style : undefined}
        >
            <div className={styles.caption}>
                {!hidePosition && <span>{index + 1}. </span>} {sheet.name}
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
