import { PayloadedAction } from 'utils/store/actionTypes';
import { ThemeType } from './appReducer';

const SWITCH_THEME = 'APP/SWITCH_THEME';
function switchTheme(mode?: Nullable<ThemeType>): PayloadedAction<Nullable<ThemeType>> {
    return { type: SWITCH_THEME, payload: mode };
}

export const appAction = {
    switchTheme,
};

export const appActionTypes = {
    SWITCH_THEME,
    switchTheme,
};