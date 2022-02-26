import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
    GenreJsModel,
    GenreItemJsModel,
} from 'domain/api/JsModels';
import {
    DEFAULT_AUTHORS_SIZE,
    DEFAULT_SHEETS_SIZE,
    FAVORITE_AUTHORS_SIZE,
    FAVORITE_SHEETS_SIZE,
    RANDOM_AUTHORS_SIZE,
    RANDOM_SHEETS_SIZE,
    TOP_AUTHORS_SIZE,
    TOP_SHEETS_SIZE,
} from 'utils/constants';
import { api, retrieveData } from './apiConfig';

const apiPath = `/api/pianosheet`;

export class SheetsClient {
    /** Получение всех авторов */
    public static getAuthors(letter?: string, page?: number): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/`, {
                params: { letter, page, order_by: 'name', page_size: DEFAULT_AUTHORS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение автора по алиасу */
    public static getAuthorByAlias(alias?: string): Promise<AuthorJsModel> {
        return api.get(`${apiPath}/author/`, { params: { alias } }).then(retrieveData);
    }

    /** Получение автора по id */
    public static getAuthorById(id?: number): Promise<AuthorItemJsModel> {
        return api.get(`${apiPath}/author/${id}/`).then(retrieveData);
    }

    /** Получение авторов по alias-у жанра */
    public static getAuthorByGenreAlias(
        genre_alias: string,
        page?: number,
    ): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/`, {
                params: { genre_alias, page, page_size: DEFAULT_AUTHORS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение топ авторов */
    public static getTopAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/`, {
                params: { order_by: '-rate', page_size: TOP_AUTHORS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение рандомного списка авторов */
    public static getRandomAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/random/`, { params: { page_size: RANDOM_AUTHORS_SIZE } })
            .then(retrieveData);
    }

    /** Получение списка избранных авторов */
    public static getFavoriteAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/favorite/`, { params: { page_size: FAVORITE_AUTHORS_SIZE } })
            .then(retrieveData);
    }

    /** Добавление автора */
    public static addAuthor(author: FormData): Promise<AuthorItemJsModel> {
        return api.post(`${apiPath}/author/`, author).then(retrieveData);
    }

    /** Добавление автора в список избранных */
    public static addAuthorToFavorite(author: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/author/favorite/`, author).then(retrieveData);
    }

    /** Проставление лайка автору */
    public static addLikeToAuthor(author: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/author/like/`, author).then(retrieveData);
    }

    /** Редактирование автора по id */
    public static editAuthorById(id: number, author: FormData): Promise<AuthorItemJsModel> {
        return api.patch(`${apiPath}/author/${id}/`, author).then(retrieveData);
    }

    /** Удаление автора */
    public static removeAuthorById(id: number): Promise<AuthorItemJsModel> {
        return api.delete(`${apiPath}/author/${id}/`).then(retrieveData);
    }

    /** Получение всех нот */
    public static getSheets(author_alias?: string, page?: number): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/note/`, {
                params: { author_alias, page, order_by: 'name', page_size: DEFAULT_SHEETS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение нот по id */
    public static getSheetById(noteId?: string): Promise<SheetItemJsModel> {
        return api.get(`${apiPath}/note/${noteId}/`).then(retrieveData);
    }

    /** Получение нот по alias-у жанра */
    public static getSheetsByGenreAlias(genre_alias: string, page?: number): Promise<SheetJsModel> {
        return api.get(`${apiPath}/note/`, { params: { genre_alias, page } }).then(retrieveData);
    }

    /** Получние топ нот */
    public static getTopSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/note/`, { params: { order_by: '-rate', page_size: TOP_SHEETS_SIZE } })
            .then(retrieveData);
    }

    /** Получние рандомного списка нот */
    public static getRandomSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/note/random/`, { params: { page_size: RANDOM_SHEETS_SIZE } })
            .then(retrieveData);
    }

    /** Получение списка избранных нот */
    public static getFavoriteSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/note/favorite/`, { params: { page_size: FAVORITE_SHEETS_SIZE } })
            .then(retrieveData);
    }

    /** Добавление нот */
    public static addSheet(sheet: FormData): Promise<SheetItemJsModel> {
        return api.post(`${apiPath}/note/`, sheet).then(retrieveData);
    }

    /** Добавление нот в список избранных */
    public static addSheetToFavorite(sheet: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/note/favorite/`, sheet).then(retrieveData);
    }

    /** Проставление лайка нотам */
    public static addLikeToSheet(sheet: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/note/like/`, sheet).then(retrieveData);
    }

    /** Поиск нот */
    public static searchSheets(query: string, page?: number): Promise<SheetJsModel> {
        return api.get(`${apiPath}/search/note/`, { params: { query, page } }).then(retrieveData);
    }

    /** Поиск авторов */
    public static searchAuthors(query: string, page?: number): Promise<AuthorJsModel> {
        return api.get(`${apiPath}/search/author/`, { params: { query, page } }).then(retrieveData);
    }

    /** Получение списка жанров */
    public static getGenres(page?: number): Promise<GenreJsModel> {
        return api.get(`${apiPath}/genre/`, { params: { page } }).then(retrieveData);
    }

    /** Получение жанра по alias */
    public static getGenreByAlias(alias: string): Promise<GenreItemJsModel> {
        return api.get(`${apiPath}/genre/${alias}/`).then(retrieveData);
    }
}
