import { SheetItemJsModel, SheetJsModel } from 'domain/api/JsModels';
import { TagsEnum } from 'redux/api';
import { BuildType, transformErrorResponse } from 'redux/apiConfig';
import { ResultResponse } from 'redux/models/sharedModels';
import {
    AddLikeToSheetRequest,
    AddSheetRequest,
    AddSheetToFavoriteRequest,
    SheetByIdRequest,
    SheetsByGenreRequest,
    SheetsRequest,
} from 'redux/models/sheetModels';
import {
    blankPagedResult,
    blankSheetItem,
    DEFAULT_SHEETS_SIZE,
    FAVORITE_SHEETS_SIZE,
    RANDOM_SHEETS_SIZE,
    TOP_SHEETS_SIZE,
} from 'utils/constants';

const baseUrl = '/note';

const SheetsResponseCallback = (r: SheetJsModel) => r || { ...blankPagedResult };
const SheetResponseCallback = (r: SheetItemJsModel) => r || { ...blankSheetItem };

// Define a service using a base URL and expected endpoints
export const sheetEndpoints = (builder: BuildType) => ({
    /** Получение всех нот по указанному автору */
    getSheets: builder.query<SheetJsModel, SheetsRequest>({
        query: ({ authorAlias, page }) => ({
            url: `${baseUrl}/`,
            params: {
                author_alias: authorAlias,
                page,
                order_by: 'name',
                page_size: DEFAULT_SHEETS_SIZE,
            },
        }),
        transformResponse: SheetsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Sheets],
    }),
    /** Получение нот по id */
    getSheetById: builder.query<SheetItemJsModel, SheetByIdRequest>({
        query: ({ noteId }) => ({ url: `${baseUrl}/${noteId}/` }),
        transformResponse: SheetResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Sheet],
    }),
    /** Получение нот по alias-у жанра */
    getSheetsByGenre: builder.query<SheetJsModel, SheetsByGenreRequest>({
        query: ({ genre_alias, page }) => ({ url: `${baseUrl}/`, params: { genre_alias, page } }),
        transformResponse: SheetsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Sheets],
    }),
    /** Получние топ нот */
    getTopSheets: builder.query<SheetJsModel, void>({
        query: () => ({
            url: `${baseUrl}/`,
            params: { order_by: '-rate', page_size: TOP_SHEETS_SIZE },
        }),
        transformResponse: SheetsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Sheets],
    }),
    /** Получние рандомного списка нот */
    getRandomSheets: builder.query<SheetJsModel, void>({
        query: () => ({ url: `${baseUrl}/random/`, params: { page_size: RANDOM_SHEETS_SIZE } }),
        transformResponse: SheetsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Sheets],
    }),
    /** Получение списка избранных нот */
    getFavoriteSheets: builder.query<SheetJsModel, void>({
        query: () => ({ url: `${baseUrl}/favorite/`, params: { page_size: FAVORITE_SHEETS_SIZE } }),
        transformResponse: SheetsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.Sheets],
    }),
    /** Добавление нот */
    addSheet: builder.mutation<SheetItemJsModel, AddSheetRequest>({
        query: ({ filename, sheetname, authorId }) => {
            let formData = new FormData();
            formData.append('filename', filename);
            formData.append('name', sheetname);
            formData.append('author', authorId.toString());
            return { url: `${baseUrl}/`, method: 'POST', body: formData };
        },
        transformResponse: SheetResponseCallback,
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Sheets],
    }),
    /** Добавление нот в список избранных */
    addSheetToFavorite: builder.mutation<ResultResponse, AddSheetToFavoriteRequest>({
        query: ({ sheetId, isFavorite }) => {
            const formData = new FormData();
            formData.append('item', `${sheetId}`);
            formData.append('favorite', `${isFavorite}`);
            return { url: `${baseUrl}/favorite/`, method: 'POST', body: formData };
        },
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Sheets],
    }),
    /** Проставление лайка нотам */
    addLikeToSheet: builder.mutation<ResultResponse, AddLikeToSheetRequest>({
        query: ({ sheetId, hasLike }) => {
            const formData = new FormData();
            formData.append('item', `${sheetId}`);
            formData.append('like', `${hasLike}`);
            return { url: `${baseUrl}/like/`, method: 'POST', body: formData };
        },
        transformErrorResponse,
        invalidatesTags: [TagsEnum.Sheets],
    }),
});
