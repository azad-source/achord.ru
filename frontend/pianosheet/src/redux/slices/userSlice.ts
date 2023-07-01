import { createSlice } from '@reduxjs/toolkit';
import { UserJsModel } from 'domain/api/JsModels';
import { RootState } from 'redux/store';

export interface UserState {
    // currentUser: UserJsModel;
    // isConfirmed?: boolean;
    // isChangedPassword?: boolean;
    currentUser: UserJsModel;
    token: string | null;
}

const blankCurrentUser: UserJsModel = { id: null, is_superuser: false };

const initialState: UserState = {
    currentUser: { ...blankCurrentUser },
    token: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, { payload }: { payload: UserJsModel }) => {
            state.currentUser = payload;
        },
        clearCurrentUser: (state) => {
            state.currentUser = { ...blankCurrentUser };
        },
    },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;

export const currentUserSelector = (state: RootState) => state.user.currentUser;
export const isSuperUserSelector = (state: RootState) => state.user.currentUser.is_superuser;

export default userSlice.reducer;
