import { AuthorItemJsModel, GenreItemJsModel } from 'domain/api/JsModels';

export interface AuthorsRequest {
    letter?: string;
    page?: number;
}

export interface AuthorsByGenreRequest {
    genreAlias: string;
    page?: number;
}

export interface AuthorByAliasRequest {
    alias?: string;
}

export interface AuthorByIdRequest {
    id?: number;
}

export interface AddAuthorRequest {
    name: string;
    info: string;
    preview: any;
    genres: GenreItemJsModel[];
}

export interface AddAuthorToFavoriteRequest {
    authorId: number;
    isFavorite: boolean;
}

export interface AddLikeToAuthorRequest {
    authorId: number;
    hasLike: boolean;
}

export interface EditAuthorByIdRequest {
    id: number;
    name: string;
    info: string;
    preview: any;
    genres: GenreItemJsModel[];
}

export interface EditAuthorByIdResponse {
    authorId: number;
    author: AuthorItemJsModel;
}

export interface RemoveAuthorByIdRequest {
    id: number;
}
