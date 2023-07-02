import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL, prepareHeaders } from './apiConfig';
import { authorEndpoints } from './endpoints/authorEndpoints';
import { sheetEndpoints } from './endpoints/sheetEndpoints';
import { genreEndpoints } from './endpoints/genreEndpoints';
import { searchEndpoints } from './endpoints/searchEndpoints';
import { userEndpoints } from './endpoints/userEndpoints';

export enum TagsEnum {
    Authors = 'Authors',
    Author = 'Author',
    Sheets = 'Sheets',
    Sheet = 'Sheet',
    Genres = 'Genres',
    Genre = 'Genre',
    SearchSheets = 'SearchSheets',
    SearchAuthors = 'SearchAuthors',
    Users = 'Users',
    User = 'User',
}

const baseUrl = `${API_URL}`;

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
    tagTypes: Object.keys(TagsEnum),
    endpoints: (builder) => ({
        ...authorEndpoints(builder),
        ...sheetEndpoints(builder),
        ...genreEndpoints(builder),
        ...searchEndpoints(builder),
        ...userEndpoints(builder),
    }),
});

export const {
    /** Author hooks */
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

    /** Sheet hooks */
    useLazyGetSheetsQuery,
    useAddSheetToFavoriteMutation,
    useLazyGetSheetByIdQuery,
    useGetTopSheetsQuery,
    useGetRandomSheetsQuery,
    useGetFavoriteSheetsQuery,
    useAddSheetMutation,

    /** Genre hooks */
    useGetGenresQuery,
    useLazyGetGenresQuery,
    useGetGenreByAliasQuery,
    useLazyGetGenreByAliasQuery,

    /** Search hooks */
    useLazySearchAuthorsQuery,
    useLazySearchSheetsQuery,
    useSearchAuthorsQuery,
    useSearchSheetsQuery,

    /** User hooks */
    useRegisterMutation,
    useLoginViaGoogleMutation,
    useLazyGetSocialLinksAuthQuery,
    useAuthorizationMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useAccountActivationMutation,
    useLazyGetUserDataQuery,
    useGetUserDataQuery,
} = api;
