import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { api } from './api';

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        search: searchReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (gDM) => gDM().concat(api.middleware),
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
