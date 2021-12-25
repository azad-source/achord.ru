import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
    GenreJsModel,
    GenreItemJsModel,
} from 'domain/api/JsModels';
import { api, retrieveData } from './apiConfig';

const apiPath = `/api/pianosheet`;

export class SheetsClient {
    /** Получение всех авторов */
    public static getAuthors(letter?: string, page?: number): Promise<AuthorJsModel> {
        return api.get(`${apiPath}/author/`, { params: { letter, page, order_by: 'name' } }).then(retrieveData);
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
        return api.get(`${apiPath}/author/`, { params: { genre_alias, page } }).then(retrieveData);
    }

    /** Получение топ авторов */
    public static getTopAuthors(): Promise<AuthorJsModel> {
        return api.get(`${apiPath}/author/`, { params: { order_by: '-rate' } }).then(retrieveData);
    }

    /** Добавление автора */
    public static addAuthor(author: FormData): Promise<AuthorItemJsModel> {
        return api.post(`${apiPath}/author/`, author).then(retrieveData);
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
                params: { author_alias, page, order_by: 'name' },
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
        return api.get(`${apiPath}/note/`, { params: { order_by: '-rate' } }).then(retrieveData);
    }

    /** Добавление нот */
    public static addSheet(sheet: FormData): Promise<SheetItemJsModel> {
        return api.post(`${apiPath}/note/`, sheet).then(retrieveData);
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
