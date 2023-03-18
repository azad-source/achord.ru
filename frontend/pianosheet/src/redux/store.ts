import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';
import { authorApi } from './api/authorApi';
import { genreApi } from './api/genreApi';
import { sheetApi } from './api/sheetApi';
import { searchApi } from './api/searchApi';
import { userApi } from './api/userApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        search: searchReducer,
        [authorApi.reducerPath]: authorApi.reducer,
        [genreApi.reducerPath]: genreApi.reducer,
        [sheetApi.reducerPath]: sheetApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (gDM) =>
        gDM()
            .concat(authorApi.middleware)
            .concat(genreApi.middleware)
            .concat(sheetApi.middleware)
            .concat(searchApi.middleware)
            .concat(userApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see setupListeners docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
