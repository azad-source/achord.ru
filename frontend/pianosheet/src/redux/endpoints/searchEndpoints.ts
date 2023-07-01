import { AuthorJsModel, SheetJsModel } from 'domain/api/JsModels';
import { TagsEnum } from 'redux/api';
import { BuildType, transformErrorResponse } from 'redux/apiConfig';
import { SearchRequest } from 'redux/models/searchModels';
import { AUTHORS_SEARCH_SIZE, SHEETS_SEARCH_SIZE, blankPagedResult } from 'utils/constants';

const baseUrl = '/search';

const AuthorsResponseCallback = (r: AuthorJsModel): AuthorJsModel => r || { ...blankPagedResult };
const SheetsResponseCallback = (r: SheetJsModel) => r || { ...blankPagedResult };

// Define a service using a base URL and expected endpoints
export const searchEndpoints = (builder: BuildType) => ({
    /** Поиск авторов */
    searchAuthors: builder.query<AuthorJsModel, SearchRequest>({
        query: ({ query, page }) => ({
            url: `${baseUrl}/author/`,
            params: { query, page, page_size: AUTHORS_SEARCH_SIZE },
        }),
        transformResponse: AuthorsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.SearchAuthors],
    }),
    /** Поиск нот */
    searchSheets: builder.query<SheetJsModel, SearchRequest>({
        query: ({ query, page }) => ({
            url: `${baseUrl}/note/`,
            params: { query, page, page_size: SHEETS_SEARCH_SIZE },
        }),
        transformResponse: SheetsResponseCallback,
        transformErrorResponse,
        providesTags: [TagsEnum.SearchSheets],
    }),
});
