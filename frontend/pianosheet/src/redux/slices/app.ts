import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { QueryStatus } from 'domain/QueryStatus';
import { AppThunk, RootState } from 'redux/store';
import { arrToString } from 'utils/arrayTransform';

export type ThemeType = 'light' | 'dark';

export interface AppState {
    theme: Nullable<ThemeType>;
    status: QueryStatus;
    warning?: string;
}

const initialState: AppState = { theme: 'light', status: QueryStatus.initial() };

export const errorHandler =
    (e: AxiosError): AppThunk =>
    (dispatch) => {
        if (axios.isAxiosError(e)) {
            const d = e.response?.data;
            const msg = Object.keys(d).reduce((sum, e) => sum + `${e}: ${arrToString(d[e])} `, '');
            const out = `${msg} (${e.response?.status}: ${d.detail || e.response?.statusText})`;
            dispatch(addWarning(out));
            setTimeout(() => dispatch(clearWarning()), 500);
        }
    };

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        switchTheme: (state, action: PayloadAction<Nullable<ThemeType>>) => {
            const theme = action.payload ?? (window.localStorage.getItem('theme') as ThemeType);
            window.localStorage.setItem('theme', theme);
            state.theme = theme;
        },
        addWarning: (state, action: PayloadAction<string>) => {
            state.warning = action.payload;
        },
        clearWarning: (state) => {
            state.warning = '';
        },
    },
});

export const { switchTheme, addWarning, clearWarning } = appSlice.actions;

export const isDarkTheme = (state: RootState) => state.app.theme === 'dark';

export default appSlice.reducer;
