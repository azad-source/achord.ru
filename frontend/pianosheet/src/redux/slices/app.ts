import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueryStatus } from 'domain/QueryStatus';
import { RootState } from 'redux/store';

export type ThemeType = 'light' | 'dark';

export interface AppState {
    theme: Nullable<ThemeType>;
    status: QueryStatus;
}

const initialState: AppState = { theme: 'light', status: QueryStatus.initial() };

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        switchTheme: (state, action: PayloadAction<ThemeType>) => {
            const theme = action.payload ?? (window.localStorage.getItem('theme') as ThemeType);
            window.localStorage.setItem('theme', theme);
            state.theme = theme;
        },
    },
});

export const { switchTheme } = appSlice.actions;

export const isDarkTheme = (state: RootState) => state.app.theme === 'dark';

export default appSlice.reducer;
