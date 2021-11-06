import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
} from 'domain/api/JsModels';
import { api, retrieveData } from './apiConfig';
import { headers } from './UsersClient';

const apiPath = `/api/pianosheet`;

export class SheetsClient {
    /** Получение всех авторов */
    public static getAuthors(
        letter?: string,
        page?: number,
    ): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/`, { params: { letter, page } })
            .then(retrieveData);
    }

    /** Получение автора по алиасу */
    public static getAuthorByAlias(alias?: string): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/`, { params: { alias } })
            .then(retrieveData);
    }

    /** Получение автора по id */
    public static getAuthorById(id?: number): Promise<AuthorItemJsModel> {
        return api.get(`${apiPath}/author/${id}`).then(retrieveData);
    }

    /** Получение всех нот */
    public static getSheets(
        author_alias?: string,
        page?: number,
    ): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/note/`, {
                params: { author_alias, page },
            })
            .then(retrieveData);
    }

    /** Получение нот по id */
    public static getSheetById(noteId?: string): Promise<SheetItemJsModel> {
        return api.get(`${apiPath}/note/${noteId}`).then(retrieveData);
    }

    /** Добавление автора */
    public static addAuthor(author: FormData): Promise<AuthorItemJsModel> {
        return api
            .post(`${apiPath}/author/`, author, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...headers(),
                },
            })
            .then(retrieveData);
    }

    /** Добавление нот */
    public static addSheet(sheet: FormData): Promise<SheetItemJsModel> {
        return api
            .post(`${apiPath}/note/`, sheet, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...headers(),
                },
            })
            .then(retrieveData);
    }

    /** Поиск нот */
    public static searchSheets(
        query: string,
        page?: number,
    ): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/search/note/`, { params: { query, page } })
            .then(retrieveData);
    }

    /** Поиск авторов */
    public static searchAuthors(
        query: string,
        page?: number,
    ): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/search/author/`, { params: { query, page } })
            .then(retrieveData);
    }

    /** Топ авторов */
    public static getTopAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/author/`, { params: { order_by: '-rate' } })
            .then(retrieveData);
    }

    /** Топ нот */
    public static getTopSheets(): Promise<SheetJsModel> {
        return api
            .get(`${apiPath}/note/`, { params: { order_by: '-rate' } })
            .then(retrieveData);
    }
}
