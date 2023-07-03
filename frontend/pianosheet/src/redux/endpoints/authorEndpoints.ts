import { MaybeDrafted } from '@reduxjs/toolkit/dist/query/core/buildThunks';
import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import { TagsEnum, api } from 'redux/api';
import { BuildType, transformErrorResponse } from 'redux/apiConfig';
import {
    AddAuthorRequest,
    AddLikeToAuthorRequest,
    AddAuthorToFavoriteRequest,
    AuthorByAliasRequest,
    AuthorByIdRequest,
    AuthorsByGenreRequest,
    AuthorsRequest,
    EditAuthorByIdRequest,
    RemoveAuthorByIdRequest,
} from 'redux/models/authorModels';
import { ResultResponse } from 'redux/models/sharedModels';
import {
    blankAuthorItem,
    blankPagedResult,
    DEFAULT_AUTHORS_SIZE,
    TOP_AUTHORS_SIZE,
} from 'utils/constants';

const baseUrl = '/author';

const AuthorsResponseCallback = (r: AuthorJsModel) => r || { ...blankPagedResult };
const AuthorResponseCallback = (r: AuthorItemJsModel) => r || { ...blankAuthorItem };

// Define a service using a base URL and expected endpoints
export const authorEndpoints = (builder: BuildType) => ({
    /** Получение всех авторов */
    getAuthors: builder.query<AuthorJsModel, AuthorsRequest>({
        query: ({ letter, page }) => ({
            url: `${baseUrl}/`,
            params: { letter, page, order_by: 'name', page_size: DEFAULT_AUTHORS_SIZE },
        }),
        transformResponse: AuthorsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Authors],
    }),
    /** Получение авторов по alias-у жанра */
    getAuthorsByGenreAlias: builder.query<AuthorJsModel, AuthorsByGenreRequest>({
        query: ({ genreAlias, page }) => ({
            url: `${baseUrl}/`,
            params: { genre_alias: genreAlias, page, page_size: DEFAULT_AUTHORS_SIZE },
        }),
        transformResponse: AuthorsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Authors],
    }),
    /** Получение топ авторов */
    getTopAuthors: builder.query<AuthorJsModel, void>({
        query: () => ({
            url: `${baseUrl}/`,
            params: { order_by: '-rate', page_size: TOP_AUTHORS_SIZE },
        }),
        transformResponse: AuthorsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Authors],
    }),
    /** Получение рандомного списка авторов */
    getRandomAuthors: builder.query<AuthorJsModel, void>({
        query: () => ({ url: `${baseUrl}/random/`, params: { page_size: TOP_AUTHORS_SIZE } }),
        transformResponse: AuthorsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Authors],
    }),
    /** Получение списка избранных авторов */
    getFavoriteAuthors: builder.query<AuthorJsModel, void>({
        query: () => ({ url: `${baseUrl}/favorite/`, params: { page_size: TOP_AUTHORS_SIZE } }),
        transformResponse: AuthorsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Authors],
    }),
    /** Получение автора по алиасу */
    getAuthorByAlias: builder.query<AuthorItemJsModel, AuthorByAliasRequest>({
        query: ({ alias }) => ({ url: `${baseUrl}/alias/${alias}` }),
        transformResponse: AuthorResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Author],
    }),
    /** Получение автора по id */
    getAuthorById: builder.query<AuthorItemJsModel, AuthorByIdRequest>({
        query: ({ id }) => ({ url: `${baseUrl}/${id}/` }),
        transformResponse: AuthorResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Author],
    }),
    /** Добавление автора */
    addAuthor: builder.mutation<AuthorItemJsModel, AddAuthorRequest>({
        query: ({ name, info, genres, preview }) => {
            let formData = new FormData();
            formData.append('preview', preview);
            formData.append('name', name);
            formData.append('info', info);
            formData.append('genres', JSON.stringify(genres.map(({ id }) => id)));
            return { url: `${baseUrl}/`, method: 'POST', body: formData };
        },
        transformResponse: AuthorResponseCallback,
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Authors],
    }),
    /** Добавление автора в список избранных */
    addAuthorToFavorite: builder.mutation<ResultResponse, AddAuthorToFavoriteRequest>({
        query: ({ authorId, isFavorite }) => {
            let formData = new FormData();
            formData.append('item', `${authorId}`);
            formData.append('favorite', `${isFavorite}`);
            return { url: `${baseUrl}/favorite/`, method: 'POST', body: formData };
        },
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Authors, TagsEnum.Author],
        onQueryStarted: (params, { dispatch, queryFulfilled }) => {
            const patchAuthors = dispatch(
                api.util.updateQueryData('getAuthors', {}, setAuthorFavorite(params)),
            );
            const patchRandomAuthors = dispatch(
                api.util.updateQueryData('getRandomAuthors', undefined, setAuthorFavorite(params)),
            );
            const patchTopAuthors = dispatch(
                api.util.updateQueryData('getTopAuthors', undefined, setAuthorFavorite(params)),
            );
            const patchFavoriteAuthors = dispatch(
                api.util.updateQueryData(
                    'getFavoriteAuthors',
                    undefined,
                    setAuthorFavorite(params),
                ),
            );
            queryFulfilled.catch(patchAuthors.undo);
            queryFulfilled.catch(patchRandomAuthors.undo);
            queryFulfilled.catch(patchTopAuthors.undo);
            queryFulfilled.catch(patchFavoriteAuthors.undo);
        },
    }),
    /** Проставление лайка автору */
    addLikeToAuthor: builder.mutation<ResultResponse, AddLikeToAuthorRequest>({
        query: ({ authorId, hasLike }) => {
            const formData = new FormData();
            formData.append('item', `${authorId}`);
            formData.append('like', `${hasLike}`);
            return { url: `${baseUrl}/like/`, method: 'POST', body: formData };
        },
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Authors, TagsEnum.Author],
    }),
    /** Редактирование автора по id */
    editAuthorById: builder.mutation<AuthorItemJsModel, EditAuthorByIdRequest>({
        query: ({ id, name, info, genres, preview }) => {
            let formData = new FormData();
            formData.append('preview', preview);
            formData.append('name', name);
            formData.append('info', info);
            formData.append('genres', JSON.stringify(genres.map(({ id }) => id)));
            return { url: `${baseUrl}/${id}/`, method: 'PATCH', body: formData };
        },
        transformResponse: AuthorResponseCallback,
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Author],
    }),
    /** Удаление автора */
    removeAuthorById: builder.mutation<AuthorItemJsModel, RemoveAuthorByIdRequest>({
        query: ({ id }) => ({ url: `${baseUrl}/${id}/`, method: 'DELETE' }),
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Authors],
    }),
});

const setAuthorFavorite = ({ authorId, isFavorite }: AddAuthorToFavoriteRequest) => {
    return (draft: MaybeDrafted<AuthorJsModel>) => {
        const currentAuthor = draft.results.find((i) => i.id === authorId);
        if (currentAuthor) {
            currentAuthor.favorite = isFavorite;
        }
    };
};
