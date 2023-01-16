import { AuthorJsModel, AuthorItemJsModel } from 'domain/api/JsModels';
import {
    DEFAULT_AUTHORS_SIZE,
    FAVORITE_AUTHORS_SIZE,
    RANDOM_AUTHORS_SIZE,
    TOP_AUTHORS_SIZE,
} from 'utils/constants';
import { api, pianosheetURL, retrieveData } from './apiConfig';

const apiPath = `${pianosheetURL}/author`;

export class AuthorClient {
    /** Получение всех авторов */
    public static getAuthors(letter?: string, page?: number): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/`, {
                params: { letter, page, order_by: 'name', page_size: DEFAULT_AUTHORS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение автора по алиасу */
    public static getAuthorByAlias(alias?: string): Promise<AuthorJsModel> {
        return api.get(`${apiPath}/`, { params: { alias } }).then(retrieveData);
    }

    /** Получение автора по id */
    public static getAuthorById(id?: number): Promise<AuthorItemJsModel> {
        return api.get(`${apiPath}/${id}/`).then(retrieveData);
    }

    /** Получение авторов по alias-у жанра */
    public static getAuthorByGenreAlias(
        genre_alias: string,
        page?: number,
    ): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/`, {
                params: { genre_alias, page, page_size: DEFAULT_AUTHORS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение топ авторов */
    public static getTopAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/`, {
                params: { order_by: '-rate', page_size: TOP_AUTHORS_SIZE },
            })
            .then(retrieveData);
    }

    /** Получение рандомного списка авторов */
    public static getRandomAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/random/`, { params: { page_size: RANDOM_AUTHORS_SIZE } })
            .then(retrieveData);
    }

    /** Получение списка избранных авторов */
    public static getFavoriteAuthors(): Promise<AuthorJsModel> {
        return api
            .get(`${apiPath}/favorite/`, { params: { page_size: FAVORITE_AUTHORS_SIZE } })
            .then(retrieveData);
    }

    /** Добавление автора */
    public static addAuthor(author: FormData): Promise<AuthorItemJsModel> {
        return api.post(`${apiPath}/`, author).then(retrieveData);
    }

    /** Добавление автора в список избранных */
    public static addAuthorToFavorite(author: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/favorite/`, author).then(retrieveData);
    }

    /** Проставление лайка автору */
    public static addLikeToAuthor(author: FormData): Promise<{ result: string }> {
        return api.post(`${apiPath}/like/`, author).then(retrieveData);
    }

    /** Редактирование автора по id */
    public static editAuthorById(id: number, author: FormData): Promise<AuthorItemJsModel> {
        return api.patch(`${apiPath}/${id}/`, author).then(retrieveData);
    }

    /** Удаление автора */
    public static removeAuthorById(id: number): Promise<AuthorItemJsModel> {
        return api.delete(`${apiPath}/${id}/`).then(retrieveData);
    }
}
