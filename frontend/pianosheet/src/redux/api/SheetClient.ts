import { SheetJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import {
    DEFAULT_SHEETS_SIZE,
    FAVORITE_SHEETS_SIZE,
    RANDOM_SHEETS_SIZE,
    TOP_SHEETS_SIZE,
} from 'utils/constants';
import { api, pianosheetURL, retrieveData } from './apiConfig';

const apiPath = `${pianosheetURL}/note`;

export class SheetClient {
    /** Получение всех нот */
    public static getSheets(author_alias?: string, page?: number): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/`, {
                params: { author_alias, page, order_by: 'name', page_size: DEFAULT_SHEETS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение нот по id */
    public static getSheetById(noteId?: string): Promise<SheetItemJsModel> {
        return api.get(`${apiPath}/${noteId}/`).then(retrieveData);
    }

    /** Получение нот по alias-у жанра */
    public static getSheetsByGenreAlias(genre_alias: string, page?: number): Promise<SheetJsModel> {
        return api.get(`${apiPath}/`, { params: { genre_alias, page } }).then(retrieveData);
    }

    /** Получние топ нот */
    public static getTopSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/`, { params: { order_by: '-rate', page_size: TOP_SHEETS_SIZE } })
            .then(retrieveData);
    }

    /** Получние рандомного списка нот */
    public static getRandomSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/random/`, { params: { page_size: RANDOM_SHEETS_SIZE } })
            .then(retrieveData);
    }

    /** Получение списка избранных нот */
    public static getFavoriteSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/favorite/`, { params: { page_size: FAVORITE_SHEETS_SIZE } })
            .then(retrieveData);
    }

    /** Добавление нот */
    public static addSheet(sheet: FormData): Promise<SheetItemJsModel> {
        return api.post(`${apiPath}/`, sheet).then(retrieveData);
    }

    /** Добавление нот в список избранных */
    public static addSheetToFavorite(sheet: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/favorite/`, sheet).then(retrieveData);
    }

    /** Проставление лайка нотам */
    public static addLikeToSheet(sheet: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/like/`, sheet).then(retrieveData);
    }
}
