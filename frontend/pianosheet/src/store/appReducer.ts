import { Action } from 'redux';
import produce from 'immer';
import { appActionTypes } from './appActions';

export type ThemeType = 'light' | 'dark';

export interface AppState {
    theme: ThemeType;
}

const appDefaultState: AppState = {
    theme: 'light',
};

const { SWITCH_THEME, switchTheme } = appActionTypes;

export function appReducer(state: AppState = appDefaultState, action: Action): AppState {
    switch (action.type) {
        case SWITCH_THEME: {
            const { payload: mode } = action as ReturnType<typeof switchTheme>;

            return produce(state, (draft) => {
                draft.theme = mode;
            });
        }

        default: {
            return state;
        }
    }
}
