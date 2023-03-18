import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthorJsModel, SheetJsModel } from 'domain/api/JsModels';
import { API_URL, prepareHeaders, transformErrorResponse } from 'redux/api/apiConfig';
import { SearchRequest } from 'redux/models/searchModels';
import { AUTHORS_SEARCH_SIZE, SHEETS_SEARCH_SIZE, blankPagedResult } from 'utils/constants';

const baseUrl = `${API_URL}/search`;

const AuthorsResponseCallback = (r: AuthorJsModel): AuthorJsModel => r || { ...blankPagedResult };

const SheetsResponseCallback = (r: SheetJsModel) => r || { ...blankPagedResult };

// Define a service using a base URL and expected endpoints
export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    tagTypes: ['SearchSheets', 'SearchAuthors'],
    endpoints: (builder) => ({
        /** Поиск авторов */
        searchAuthors: builder.query<AuthorJsModel, SearchRequest>({
            query: ({ query, page }) => ({
                url: '/author/',
                params: { query, page, page_size: AUTHORS_SEARCH_SIZE },
            }),
            transformResponse: AuthorsResponseCallback,
            transformErrorResponse,
            providesTags: (result, error, arg) => ['SearchAuthors'],
        }),
        /** Поиск нот */
        searchSheets: builder.query<SheetJsModel, SearchRequest>({
            query: ({ query, page }) => ({
                url: '/note/',
                params: { query, page, page_size: SHEETS_SEARCH_SIZE },
            }),
            transformResponse: SheetsResponseCallback,
            transformErrorResponse,
            providesTags: (res) => ['SearchSheets'],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useLazySearchAuthorsQuery,
    useLazySearchSheetsQuery,
    useSearchAuthorsQuery,
    useSearchSheetsQuery,
} = searchApi;
