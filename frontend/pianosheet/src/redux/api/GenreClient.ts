import { GenreJsModel, GenreItemJsModel } from 'domain/api/JsModels';
import { api, pianosheetURL, retrieveData } from './apiConfig';

const apiPath = `${pianosheetURL}/genre`;

export class GenreClient {
    /** Получение списка жанров */
    public static getGenres(page?: number): Promise<GenreJsModel> {
        return api.get(`${apiPath}/`, { params: { page } }).then(retrieveData);
    }

    /** Получение жанра по alias */
    public static getGenreByAlias(alias: string): Promise<GenreItemJsModel> {
        return api.get(`${apiPath}/${alias}/`).then(retrieveData);
    }
}
