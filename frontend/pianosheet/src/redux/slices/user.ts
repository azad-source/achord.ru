import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { TokenJsModel, UserJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { errorData } from 'redux/api/apiConfig';
import { login, UserClient } from 'redux/api/UserClient';
import { arrToString } from 'utils/arrayTransform';

export interface UserState {
    currentUser: UserJsModel;
    status: QueryStatus;
    isConfirmed?: boolean;
    isChangedPassword?: boolean;
}

const initialState: UserState = { currentUser: { id: null }, status: QueryStatus.initial() };

interface RegistrationProps {
    email: string;
    password: string;
    re_password: string;
}

export type ChangePasswordType = {
    isChangedPassword: boolean;
    message?: string[];
};

export type ConfirmationType = {
    isConfirmed: boolean;
    message?: string;
};

export const registration = createAsyncThunk<
    TokenJsModel,
    RegistrationProps,
    { rejectValue: AxiosError }
>('user/registration', async ({ email, password, re_password }) => {
    localStorage.removeItem('Token');

    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('re_password', re_password);

    try {
        const response = await UserClient.register(formData);
        login(response);
        return response;
    } catch (err: any) {
        return err;
    }
});

interface AuthorizationProps {
    email: string;
    password: string;
}

export const authorization = createAsyncThunk<
    TokenJsModel,
    AuthorizationProps,
    { rejectValue: AxiosError }
>('user/authorization', async ({ email, password }) => {
    localStorage.removeItem('Token');

    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
        const response = await UserClient.login(formData);
        login(response);
        return response;
    } catch (err: any) {
        return err;
    }
});

interface ConfirmEmailProps {
    userId: string;
    token: string;
}

export const confirmEmail = createAsyncThunk<
    {
        is: string;
        token: string;
        isConfirmed: boolean;
    },
    ConfirmEmailProps,
    { rejectValue: AxiosError }
>('user/confirmEmail', async ({ userId, token }) => {
    let formData = new FormData();
    formData.append('uid', userId);
    formData.append('token', token);

    try {
        const response = await UserClient.accountActivation(formData);
        if (response.status === 204) {
            return { id: userId, token };
        }
    } catch (err: any) {
        return err;
    }
});

export const resetPassword = createAsyncThunk<AxiosResponse, string, { rejectValue: AxiosError }>(
    'user/resetPassword',
    async (email: string) => {
        let formData = new FormData();
        formData.append('email', email);

        try {
            const response = await UserClient.resetPassword(formData);
            return response;
        } catch (err: any) {
            return err;
        }
    },
);

interface ChangePasswordProps {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
}

export const changePassword = createAsyncThunk<
    ChangePasswordType,
    ChangePasswordProps,
    { rejectValue: AxiosError }
>(
    'user/changePassword',
    async ({ uid, token, new_password, re_new_password }, { fulfillWithValue }) => {
        let formData = new FormData();
        formData.append('uid', uid);
        formData.append('token', token);
        formData.append('new_password', new_password);
        formData.append('re_new_password', re_new_password);

        try {
            const response = await UserClient.changePassword(formData);
            fulfillWithValue(response);
            return { isChangePassword: true };
        } catch (err: any) {
            return err;
        }
    },
);

export const getCurrentUser = createAsyncThunk<UserJsModel, boolean, { rejectValue: AxiosError }>(
    'user/getCurrentUser',
    async (logged, { getState }) => {
        const { currentUser } = getState() as UserState;
        try {
            if (!currentUser.id && logged) {
                const response = await UserClient.getUserData();
                return response;
            }
        } catch (err: any) {
            return err;
        }
    },
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        dropError: (state) => {
            state.status = QueryStatus.initial();
        },
        clearCurrentUser: (state) => {
            state.currentUser = { id: null };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registration.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(registration.fulfilled, (state) => {
                state.status = QueryStatus.success();
            })
            .addCase(registration.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(authorization.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(authorization.fulfilled, (state) => {
                state.status = QueryStatus.success();
            })
            .addCase(authorization.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(confirmEmail.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(confirmEmail.fulfilled, (state) => {
                state.status = QueryStatus.success();
                state.isConfirmed = true;
            })
            .addCase(confirmEmail.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
                state.isConfirmed = false;
            })
            .addCase(resetPassword.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.status = QueryStatus.success();
            })
            .addCase(resetPassword.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(changePassword.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.status = QueryStatus.success();
                state.isChangedPassword = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                const result = action.payload?.response;
                let message: string[] = [];
                if (result?.status === 403 || result?.status === 400) {
                    if (result.data && Object.keys(result.data).length > 0) {
                        message = Object.values(result.data);
                    }
                }

                const error = action.payload;

                state.status = QueryStatus.error(
                    result?.statusText || '',
                    arrToString(message),
                    error,
                );
                state.isChangedPassword = false;
            })
            .addCase(getCurrentUser.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(getCurrentUser.fulfilled, (state) => {
                state.status = QueryStatus.success();
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            });
    },
});

export const { dropError, clearCurrentUser } = userSlice.actions;

// export const isDarkTheme = (state: RootState) => state.app.theme === 'dark';

export default userSlice.reducer;
