import { AuthorJsModel } from 'domain/api/JsModels';

export interface SearchRequest {
    query: string;
    page?: number;
}

// export interface SearchAuthorsResponse {
//     authors: AuthorJsModel;
//     query: string;
// }
