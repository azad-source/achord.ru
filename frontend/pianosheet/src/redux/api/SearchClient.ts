import { AuthorJsModel, SheetJsModel } from 'domain/api/JsModels';
import { api, pianosheetURL, retrieveData } from './apiConfig';

const apiPath = `${pianosheetURL}/search`;

export class SearchClient {
    /** Поиск нот */
    public static searchSheets(query: string, page?: number): Promise<SheetJsModel> {
        return api.get(`${apiPath}/note/`, { params: { query, page } }).then(retrieveData);
    }

    /** Поиск авторов */
    public static searchAuthors(query: string, page?: number): Promise<AuthorJsModel> {
        return api.get(`${apiPath}/author/`, { params: { query, page } }).then(retrieveData);
    }
}
