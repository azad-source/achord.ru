import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authorReducer from './slices/author';
import sheetReducer from './slices/sheet';
import genreReducer from './slices/genre';
import searchReducer from './slices/search';
import appReducer from './slices/app';
import userReducer from './slices/user';

export const store = configureStore({
    reducer: {
        author: authorReducer,
        sheet: sheetReducer,
        genre: genreReducer,
        search: searchReducer,
        app: appReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
