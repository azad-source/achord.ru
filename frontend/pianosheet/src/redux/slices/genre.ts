import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { GenreItemJsModel, GenreJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { errorData } from 'redux/api/apiConfig';
import { GenreClient } from 'redux/api/GenreClient';
import { blankGenreItem, blankPagedResult } from 'utils/constants';

export interface GenreState {
    list: GenreJsModel;
    current?: GenreItemJsModel;
    status: QueryStatus;
    query: string;
    applied: boolean;
}

const initialState: GenreState = {
    list: { ...blankPagedResult },
    status: QueryStatus.initial(),
    query: '',
    applied: false,
};

export const getGenres = createAsyncThunk<
    GenreJsModel,
    number | undefined,
    { rejectValue: AxiosError }
>('genre/getGenres', async (page) => {
    try {
        const response = await GenreClient.getGenres(page);
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getGenreByAlias = createAsyncThunk<
    GenreItemJsModel,
    string,
    { rejectValue: AxiosError }
>('genre/getGenreByAlias', async (alias) => {
    try {
        const response = await GenreClient.getGenreByAlias(alias);
        return response;
    } catch (err: any) {
        return err;
    }
});

export const genreSlice = createSlice({
    name: 'genre',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getGenres.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getGenres.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getGenres.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getGenreByAlias.pending, (state) => {
                state.status = QueryStatus.request();
                state.current = { ...blankGenreItem };
            })
            .addCase(getGenreByAlias.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.current = action.payload;
            })
            .addCase(getGenreByAlias.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
                state.current = { ...blankGenreItem };
            });
    },
});

export default genreSlice.reducer;
