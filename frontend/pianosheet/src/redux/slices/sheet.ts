import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { SheetItemJsModel, SheetJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { errorData } from 'redux/api/apiConfig';
import { SheetClient } from 'redux/api/SheetClient';
import { blankPagedResult, blankSheetItem } from 'utils/constants';

export interface SheetState {
    list: SheetJsModel;
    current: SheetItemJsModel;
    status: QueryStatus;
    currentStatus: QueryStatus;
    query: string;
    applied: boolean;
}

const initialState: SheetState = {
    list: { ...blankPagedResult },
    current: { ...blankSheetItem },
    status: QueryStatus.initial(),
    currentStatus: QueryStatus.initial(),
    query: '',
    applied: false,
};

interface GetSheetsProps {
    author_alias?: string;
    page?: number;
}

export const getSheets = createAsyncThunk<
    SheetJsModel,
    GetSheetsProps | undefined,
    { rejectValue: AxiosError }
>('sheet/getSheets', async ({ author_alias, page } = {}) => {
    try {
        const response = await SheetClient.getSheets(author_alias, page);
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getTopSheets = createAsyncThunk<SheetJsModel, undefined, { rejectValue: AxiosError }>(
    'sheet/getTopSheets',
    async () => {
        try {
            const response = await SheetClient.getTopSheets();
            return response;
        } catch (err: any) {
            return err;
        }
    },
);

export const getFavoriteSheets = createAsyncThunk<
    SheetJsModel,
    undefined,
    { rejectValue: AxiosError }
>('sheet/getFavoriteSheets', async () => {
    try {
        const response = await SheetClient.getFavoriteSheets();
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getRandomSheets = createAsyncThunk<
    SheetJsModel,
    undefined,
    { rejectValue: AxiosError }
>('sheet/getRandomSheets', async () => {
    try {
        const response = await SheetClient.getRandomSheets();
        return response;
    } catch (err: any) {
        return err;
    }
});

export const addSheet = createAsyncThunk<SheetItemJsModel, FormData, { rejectValue: AxiosError }>(
    'sheet/addSheet',
    async (formData) => {
        try {
            const response = await SheetClient.addSheet(formData);
            return response;
        } catch (err: any) {
            return err;
        }
    },
);

interface AddSheetToFavoriteProps {
    sheetId: number;
    isFavorite: boolean;
}

export const addSheetToFavorite = createAsyncThunk<
    AddSheetToFavoriteProps,
    AddSheetToFavoriteProps,
    { rejectValue: AxiosError }
>('sheet/addSheetToFavorite', async ({ sheetId, isFavorite }) => {
    try {
        const favorite = new FormData();
        favorite.append('item', `${sheetId}`);
        favorite.append('favorite', `${isFavorite}`);
        const response = await SheetClient.addSheetToFavorite(favorite);

        if (response?.result === 'OK') {
            return { sheetId, isFavorite };
        }
    } catch (err: any) {
        return err;
    }
});

interface LikeSheetProps {
    sheetId: number;
    hasLike: boolean;
}

export const likeSheet = createAsyncThunk<
    LikeSheetProps,
    LikeSheetProps,
    { rejectValue: AxiosError }
>('sheet/likeSheet', async ({ sheetId, hasLike }) => {
    try {
        const like = new FormData();
        like.append('item', `${sheetId}`);
        like.append('like', `${hasLike}`);
        const response = await SheetClient.addLikeToSheet(like);

        if (response?.result === 'OK') {
            return { sheetId, hasLike };
        }
    } catch (err: any) {
        return err;
    }
});

export const sheetSlice = createSlice({
    name: 'sheet',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSheets.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getSheets.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getSheets.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getTopSheets.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getTopSheets.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getTopSheets.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getFavoriteSheets.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getFavoriteSheets.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getFavoriteSheets.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getRandomSheets.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getRandomSheets.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getRandomSheets.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(addSheet.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(addSheet.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list.results = [...state.list.results, action.payload];
            })
            .addCase(addSheet.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(addSheetToFavorite.pending, (state, action) => {
                state.currentStatus = QueryStatus.request();
                state.current.id = action.meta.arg.sheetId;
            })
            .addCase(addSheetToFavorite.fulfilled, (state, action) => {
                state.currentStatus = QueryStatus.success();
                const { sheetId, isFavorite } = action.payload;

                state.list.results.forEach(({ id }, index) => {
                    if (id === sheetId) {
                        state.list.results[index].favorite = isFavorite;
                    }
                });
            })
            .addCase(addSheetToFavorite.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.currentStatus = QueryStatus.error(statusText, reason, error);
            })
            .addCase(likeSheet.pending, (state, action) => {
                state.currentStatus = QueryStatus.request();
                state.current.id = action.meta.arg.sheetId;
            })
            .addCase(likeSheet.fulfilled, (state, action) => {
                state.currentStatus = QueryStatus.success();
                const { sheetId, hasLike } = action.payload;

                state.list.results.forEach(({ id }, index) => {
                    if (id === sheetId) {
                        state.list.results[index].like = hasLike;
                        state.list.results[index].like_count =
                            state.list.results[index].like_count + (hasLike ? 1 : -1);
                    }
                });
            })
            .addCase(likeSheet.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.currentStatus = QueryStatus.error(statusText, reason, error);
            });
    },
});

export default sheetSlice.reducer;
