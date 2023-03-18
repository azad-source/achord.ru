import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import { API_URL, prepareHeaders, transformErrorResponse } from 'redux/api/apiConfig';
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

const baseUrl = `${API_URL}/author`;

const AuthorsResponseCallback = (r: AuthorJsModel) => r || { ...blankPagedResult };
const AuthorResponseCallback = (r: AuthorItemJsModel) => r || { ...blankAuthorItem };
const AuthorByAliasResponseCallback = (r: AuthorJsModel) => r.results[0] || { ...blankAuthorItem };

// Define a service using a base URL and expected endpoints
export const authorApi = createApi({
    reducerPath: 'authorApi',
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    tagTypes: ['Authors', 'Author'],
    endpoints: (builder) => ({
        /** Получение всех авторов */
        getAuthors: builder.query<AuthorJsModel, AuthorsRequest>({
            query: ({ letter, page }) => ({
                url: '/',
                params: { letter, page, order_by: 'name', page_size: DEFAULT_AUTHORS_SIZE },
            }),
            transformResponse: AuthorsResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Authors'],
        }),
        /** Получение авторов по alias-у жанра */
        getAuthorsByGenreAlias: builder.query<AuthorJsModel, AuthorsByGenreRequest>({
            query: ({ genreAlias, page }) => ({
                url: '/',
                params: { genre_alias: genreAlias, page, page_size: DEFAULT_AUTHORS_SIZE },
            }),
            transformResponse: AuthorsResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Authors'],
        }),
        /** Получение топ авторов */
        getTopAuthors: builder.query<AuthorJsModel, void>({
            query: () => ({
                url: '/',
                params: { order_by: '-rate', page_size: TOP_AUTHORS_SIZE },
            }),
            transformResponse: AuthorsResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Authors'],
        }),
        /** Получение рандомного списка авторов */
        getRandomAuthors: builder.query<AuthorJsModel, void>({
            query: () => ({ url: '/random/', params: { page_size: TOP_AUTHORS_SIZE } }),
            transformResponse: AuthorsResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Authors'],
        }),
        /** Получение списка избранных авторов */
        getFavoriteAuthors: builder.query<AuthorJsModel, void>({
            query: () => ({ url: '/favorite/', params: { page_size: TOP_AUTHORS_SIZE } }),
            transformResponse: AuthorsResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Authors'],
        }),
        /** Получение автора по алиасу */
        getAuthorByAlias: builder.query<AuthorItemJsModel, AuthorByAliasRequest>({
            query: ({ alias }) => ({ url: '/', params: { alias } }),
            // TODO: мы тут должны по идее получать от бэка AuthorItemJsModel, а не AuthorJsModel
            transformResponse: AuthorByAliasResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Author'],
        }),
        /** Получение автора по id */
        getAuthorById: builder.query<AuthorItemJsModel, AuthorByIdRequest>({
            query: ({ id }) => ({ url: `/${id}/` }),
            transformResponse: AuthorResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Author'],
        }),
        /** Добавление автора */
        addAuthor: builder.mutation<AuthorItemJsModel, AddAuthorRequest>({
            query: ({ name, info, genres, preview }) => {
                let formData = new FormData();
                formData.append('preview', preview);
                formData.append('name', name);
                formData.append('info', info);
                formData.append('genres', JSON.stringify(genres.map(({ id }) => id)));
                return { url: '/', method: 'POST', body: formData };
            },
            transformResponse: AuthorResponseCallback,
            transformErrorResponse,
            invalidatesTags: ['Authors'],
        }),
        /** Добавление автора в список избранных */
        addAuthorToFavorite: builder.mutation<ResultResponse, AddAuthorToFavoriteRequest>({
            query: ({ authorId, isFavorite }) => {
                let formData = new FormData();
                formData.append('item', `${authorId}`);
                formData.append('favorite', `${isFavorite}`);
                return { url: '/favorite/', method: 'POST', body: formData };
            },
            transformErrorResponse,
            invalidatesTags: ['Authors', 'Author'],
        }),
        /** Проставление лайка автору */
        addLikeToAuthor: builder.mutation<ResultResponse, AddLikeToAuthorRequest>({
            query: ({ authorId, hasLike }) => {
                const formData = new FormData();
                formData.append('item', `${authorId}`);
                formData.append('like', `${hasLike}`);
                return { url: '/like/', method: 'POST', body: formData };
            },
            transformErrorResponse,
            invalidatesTags: ['Authors', 'Author'],
        }),
        /** Редактирование автора по id */
        editAuthorById: builder.mutation<AuthorItemJsModel, EditAuthorByIdRequest>({
            query: ({ id, name, info, genres, preview }) => {
                let formData = new FormData();
                formData.append('preview', preview);
                formData.append('name', name);
                formData.append('info', info);
                formData.append('genres', JSON.stringify(genres.map(({ id }) => id)));
                return { url: `/${id}/`, method: 'PATCH', body: formData };
            },
            transformResponse: AuthorResponseCallback,
            transformErrorResponse,
            invalidatesTags: ['Author'],
        }),
        /** Удаление автора */
        // TODO: по идее ничего не должен возвращать
        removeAuthorById: builder.mutation<AuthorItemJsModel, RemoveAuthorByIdRequest>({
            query: ({ id }) => ({ url: `/${id}/`, method: 'DELETE' }),
            transformResponse: AuthorResponseCallback,
            transformErrorResponse,
            invalidatesTags: ['Authors'],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetAuthorsQuery,
    useLazyGetAuthorsQuery,
    useLazyGetAuthorsByGenreAliasQuery,
    useGetTopAuthorsQuery,
    useGetRandomAuthorsQuery,
    useGetFavoriteAuthorsQuery,
    useLazyGetAuthorByAliasQuery,
    useLazyGetAuthorByIdQuery,
    useAddAuthorMutation,
    useAddAuthorToFavoriteMutation,
    useAddLikeToAuthorMutation,
    useEditAuthorByIdMutation,
    useRemoveAuthorByIdMutation,
} = authorApi;
