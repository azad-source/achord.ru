import { connectRouter, RouterRootState } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { sheetsReducer, SheetsState } from './sheetsReducer';
import { usersReducer, UsersState } from './usersReducer';
import { History } from 'history';
import { appReducer, AppState } from './appReducer';

export interface RootState extends RouterRootState {
    sheets: SheetsState;
    users: UsersState;
    app: AppState;
}

export function rootReducer(history: History): Reducer<RootState> {
    return combineReducers<RootState>({
        router: connectRouter(history),
        sheets: sheetsReducer,
        users: usersReducer,
        app: appReducer,
    });
}
