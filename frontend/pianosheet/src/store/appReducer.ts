import { Action } from 'redux';
import produce from 'immer';
import { appActionTypes } from './appActions';

export type ThemeType = 'light' | 'dark';

export interface AppState {
    theme: Nullable<ThemeType>;
}

const appDefaultState: AppState = {
    theme: window.localStorage.getItem('theme') as ThemeType,
};

const { SWITCH_THEME, switchTheme } = appActionTypes;

export function appReducer(state: AppState = appDefaultState, action: Action): AppState {
    switch (action.type) {
        case SWITCH_THEME: {
            const { payload: mode } = action as ReturnType<typeof switchTheme>;

            const theme = mode ?? (window.localStorage.getItem('theme') as ThemeType);
            window.localStorage.setItem('theme', theme);

            return produce(state, (draft) => {
                draft.theme = theme;
            });
        }

        default: {
            return state;
        }
    }
}
