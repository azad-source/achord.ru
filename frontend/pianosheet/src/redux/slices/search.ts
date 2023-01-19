import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AuthorJsModel, SheetJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { errorData } from 'redux/api/apiConfig';
import { SearchClient } from 'redux/api/SearchClient';
import { blankPagedResult, blankSearch } from 'utils/constants';

export interface SearchState {
    sheets: SheetJsModel;
    authors: AuthorJsModel;
    status: QueryStatus;
    query: string;
    applied: boolean;
}

const initialState: SearchState = { ...blankSearch };

export const searchSheets = createAsyncThunk<
    { sheets: SheetJsModel; authors: AuthorJsModel; query: string },
    string,
    { rejectValue: AxiosError }
>('search/searchSheets', async (query) => {
    return Promise.all([SearchClient.searchSheets(query), SearchClient.searchAuthors(query)])
        .then((results) => {
            const sheets = results[0];
            const authors = results[1];
            return { sheets, authors, query };
        })
        .catch((err: any) => {
            return err;
        });
});

export const searchAuthorsByPage = createAsyncThunk<
    { authors: AuthorJsModel; query: string },
    { query: string; page: number },
    { rejectValue: AxiosError }
>('search/searchAuthorsByPage', async ({ query, page }) => {
    return SearchClient.searchAuthors(query, page)
        .then((authors) => ({ authors, query }))
        .catch((err: any) => err);
});

export const searchSheetsByPage = createAsyncThunk<
    { sheets: SheetJsModel; query: string },
    { query: string; page: number },
    { rejectValue: AxiosError }
>('search/searchSheetsByPage', async ({ query, page }) => {
    return SearchClient.searchSheets(query, page)
        .then((sheets) => ({ sheets, query }))
        .catch((err: any) => err);
});

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        dropSearch: (state) => {
            state.applied = false;
            state.authors = { ...blankPagedResult };
            state.sheets = { ...blankPagedResult };
            state.query = '';
            state.status = QueryStatus.initial();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchSheets.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(searchSheets.fulfilled, (state, action) => {
                const { sheets, authors, query } = action.payload;
                state.status = QueryStatus.success();
                state.sheets = sheets;
                state.authors = authors;
                state.applied = true;
                state.query = query;
            })
            .addCase(searchSheets.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
                state.applied = false;
            })
            .addCase(searchAuthorsByPage.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(searchAuthorsByPage.fulfilled, (state, action) => {
                const { authors, query } = action.payload;
                state.status = QueryStatus.success();
                state.authors = authors;
                state.applied = true;
                state.query = query;
            })
            .addCase(searchAuthorsByPage.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
                state.applied = false;
            })
            .addCase(searchSheetsByPage.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(searchSheetsByPage.fulfilled, (state, action) => {
                const { sheets, query } = action.payload;
                state.status = QueryStatus.success();
                state.sheets = sheets;
                state.applied = true;
                state.query = query;
            })
            .addCase(searchSheetsByPage.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
                state.applied = false;
            });
    },
});

export const { dropSearch } = searchSlice.actions;

export default searchSlice.reducer;
