import { GenreItemJsModel, GenreJsModel } from 'domain/api/JsModels';
import { TagsEnum } from 'redux/api';
import { BuildType, transformErrorResponse } from 'redux/apiConfig';
import { GenreByAliasRequest, GenresRequest } from 'redux/models/genreModels';
import { blankGenreItem, blankPagedResult } from 'utils/constants';

const baseUrl = '/genre';

const GenresResponseCallback = (r: GenreJsModel) => r || { ...blankPagedResult };
const GenreResponseCallback = (r: GenreItemJsModel) => r || { ...blankGenreItem };

// Define a service using a base URL and expected endpoints
export const genreEndpoints = (builder: BuildType) => ({
    /** Получение всех жанров */
    getGenres: builder.query<GenreJsModel, GenresRequest>({
        query: ({ page }) => ({ url: `${baseUrl}/`, params: { page } }),
        transformResponse: GenresResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Genres],
    }),
    /** Получение жанра по alias */
    getGenreByAlias: builder.query<GenreItemJsModel, GenreByAliasRequest>({
        query: ({ alias }) => ({ url: `${baseUrl}/${alias}/` }),
        transformResponse: GenreResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Genre],
    }),
});
