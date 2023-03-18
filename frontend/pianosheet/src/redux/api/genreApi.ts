import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GenreItemJsModel, GenreJsModel } from 'domain/api/JsModels';
import { API_URL, prepareHeaders, transformErrorResponse } from 'redux/api/apiConfig';
import { GenreByAliasRequest, GenresRequest } from 'redux/models/genreModels';
import { blankGenreItem, blankPagedResult } from 'utils/constants';

const baseUrl = `${API_URL}/genre`;

const GenresResponseCallback = (r: GenreJsModel) => r || { ...blankPagedResult };
const GenreResponseCallback = (r: GenreItemJsModel) => r || { ...blankGenreItem };

// Define a service using a base URL and expected endpoints
export const genreApi = createApi({
    reducerPath: 'genreApi',
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    tagTypes: ['Genres', 'Genre'],
    endpoints: (builder) => ({
        /** Получение всех жанров */
        getGenres: builder.query<GenreJsModel, GenresRequest>({
            query: ({ page }) => ({ url: '/', params: { page } }),
            transformResponse: GenresResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Genres'],
        }),
        /** Получение жанра по alias */
        getGenreByAlias: builder.query<GenreItemJsModel, GenreByAliasRequest>({
            query: ({ alias }) => ({ url: `/${alias}/` }),
            transformResponse: GenreResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['Genre'],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetGenresQuery,
    useLazyGetGenresQuery,
    useGetGenreByAliasQuery,
    useLazyGetGenreByAliasQuery,
} = genreApi;
