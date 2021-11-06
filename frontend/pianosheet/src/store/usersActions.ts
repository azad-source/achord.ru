import { errorData } from 'api/apiConfig';
import { login, UsersClient } from 'api/UsersClient';
import { AxiosError } from 'axios';
import { UserJsModel } from 'domain/api/JsModels';
import { Action } from 'redux';
import { arrToString } from 'utils/arrayTransform';
import { GeneralThunkAction, PayloadedAction } from 'utils/store/actionTypes';

const REGISTRATION_STARTED = 'USERS/REGISTRATION_STARTED';
const REGISTRATION_COMPLETE = 'USERS/REGISTRATION_COMPLETE';
const REGISTRATION_FAILED = 'USERS/REGISTRATION_FAILED';
function registrationStarted(): Action {
    return { type: REGISTRATION_STARTED };
}
function registrationComplete(user: UserJsModel): PayloadedAction<UserJsModel> {
    return { type: REGISTRATION_COMPLETE, payload: user };
}
function registrationFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: REGISTRATION_FAILED, payload: { reason, message, error } };
}

function registration(
    email: string,
    password: string,
): GeneralThunkAction<Promise<void>> {
    return (dispatch) => {
        dispatch(registrationStarted());
        localStorage.removeItem('Token');

        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        return UsersClient.register(formData)
            .then((res) => {
                dispatch(registrationComplete({}));
                login(res);
            })
            .catch((res) => {
                const { statusText, reason, error } = errorData(res);
                dispatch(registrationFailed(statusText, reason, error));
            });
    };
}

const AUTHORIZATION_STARTED = 'USERS/AUTHORIZATION_STARTED';
const AUTHORIZATION_COMPLETE = 'USERS/AUTHORIZATION_COMPLETE';
const AUTHORIZATION_FAILED = 'USERS/AUTHORIZATION_FAILED';
function authorizationStarted(): Action {
    return { type: AUTHORIZATION_STARTED };
}
function authorizationComplete(
    user: UserJsModel,
): PayloadedAction<UserJsModel> {
    return { type: AUTHORIZATION_COMPLETE, payload: user };
}
function authorizationFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: AUTHORIZATION_FAILED, payload: { reason, message, error } };
}

function authorization(
    email: string,
    password: string,
): GeneralThunkAction<Promise<void>> {
    return (dispatch) => {
        dispatch(authorizationStarted());
        localStorage.removeItem('Token');

        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        return UsersClient.login(formData)
            .then((res) => {
                dispatch(authorizationComplete({}));
                login(res);
            })
            .catch((res) => {
                const { statusText, reason, error } = errorData(res);
                dispatch(authorizationFailed(statusText, reason, error));
            });
    };
}

const CONFIRM_EMAIL_STARTED = 'USERS/CONFIRM_EMAIL_STARTED';
const CONFIRM_EMAIL_COMPLETE = 'USERS/CONFIRM_EMAIL_COMPLETE';
const CONFIRM_EMAIL_FAILED = 'USERS/CONFIRM_EMAIL_FAILED';
function confirmEmailStarted(): Action {
    return { type: CONFIRM_EMAIL_STARTED };
}
function confirmEmailComplete(user: UserJsModel): PayloadedAction<UserJsModel> {
    return { type: CONFIRM_EMAIL_COMPLETE, payload: user };
}
function confirmEmailFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: CONFIRM_EMAIL_FAILED, payload: { reason, message, error } };
}

export type ConfirmationType = {
    isConfirmed: boolean;
    message?: string;
};

function confirmEmail(
    uid: string,
    token: string,
): GeneralThunkAction<Promise<ConfirmationType>> {
    return (dispatch) => {
        dispatch(confirmEmailStarted());
        let formData = new FormData();
        formData.append('uid', uid);
        formData.append('token', token);
        return UsersClient.accountActivation(formData)
            .then((result) => {
                if (result.status === 204) {
                    dispatch(confirmEmailComplete({ uid, token }));
                    return { isConfirmed: true };
                }
                dispatch(confirmEmailFailed('', '', new Error()));
                return { isConfirmed: false };
            })
            .catch((error: AxiosError) => {
                const result = error.response;

                if (result?.status === 403 || result?.status === 400) {
                    let message = '';

                    if (result.data && Object.keys(result.data).length > 0) {
                        message = arrToString(Object.values(result.data));
                    }
                    dispatch(
                        confirmEmailFailed(result.statusText, message, error),
                    );
                    return { isConfirmed: false, message };
                }

                dispatch(confirmEmailFailed('', '', error));
                return { isConfirmed: false };
            });
    };
}

const DROP_ERROR = 'USERS/DROP_ERROR';

function dropError(): Action {
    return { type: DROP_ERROR };
}

const RESET_PASSWORD_STARTED = 'USERS/RESET_PASSWORD_STARTED';
const RESET_PASSWORD_COMPLETE = 'USERS/RESET_PASSWORD_COMPLETE';
const RESET_PASSWORD_FAILED = 'USERS/RESET_PASSWORD_FAILED';
function resetPasswordStarted(): Action {
    return { type: RESET_PASSWORD_STARTED };
}
function resetPasswordComplete(): Action {
    return { type: RESET_PASSWORD_COMPLETE };
}
function resetPasswordFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: RESET_PASSWORD_FAILED, payload: { reason, message, error } };
}

function resetPassword(email: string): GeneralThunkAction<Promise<void>> {
    return (dispatch) => {
        dispatch(resetPasswordStarted());
        let formData = new FormData();
        formData.append('email', email);

        return UsersClient.resetPassword(formData)
            .then(() => {
                dispatch(resetPasswordComplete());
            })
            .catch((err) => {
                dispatch(resetPasswordFailed('', '', err));
            });
    };
}

const CHANGE_PASSWORD_STARTED = 'USERS/CHANGE_PASSWORD_STARTED';
const CHANGE_PASSWORD_COMPLETE = 'USERS/CHANGE_PASSWORD_COMPLETE';
const CHANGE_PASSWORD_FAILED = 'USERS/CHANGE_PASSWORD_FAILED';
function changePasswordStarted(): Action {
    return { type: CHANGE_PASSWORD_STARTED };
}
function changePasswordComplete(): Action {
    return { type: CHANGE_PASSWORD_COMPLETE };
}
function changePasswordFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return {
        type: CHANGE_PASSWORD_FAILED,
        payload: { reason, message, error },
    };
}

export type ChangePasswordType = {
    isChangedPassword: boolean;
    message?: string[];
};

function changePassword(
    uid: string,
    token: string,
    new_password: string,
    re_new_password: string,
): GeneralThunkAction<Promise<ChangePasswordType>> {
    return (dispatch) => {
        dispatch(changePasswordStarted());
        let formData = new FormData();
        formData.append('uid', uid);
        formData.append('token', token);
        formData.append('new_password', new_password);
        formData.append('re_new_password', re_new_password);

        return UsersClient.changePassword(formData)
            .then((res) => {
                dispatch(changePasswordComplete());
                return { isChangedPassword: true };
            })
            .catch((error: AxiosError) => {
                const result = error.response;
                let message: string[] = [];
                if (result?.status === 403 || result?.status === 400) {
                    if (result.data && Object.keys(result.data).length > 0) {
                        message = Object.values(result.data);
                    }

                    dispatch(
                        changePasswordFailed(
                            result.statusText,
                            arrToString(message),
                            error,
                        ),
                    );
                }
                return { isChangedPassword: false, message };
            });
    };
}

export const usersAction = {
    registration,
    authorization,
    confirmEmail,
    dropError,
    resetPassword,
    changePassword,
};

export const usersActionTypes = {
    REGISTRATION_STARTED,
    REGISTRATION_COMPLETE,
    REGISTRATION_FAILED,
    registrationStarted,
    registrationComplete,
    registrationFailed,
    AUTHORIZATION_STARTED,
    AUTHORIZATION_COMPLETE,
    AUTHORIZATION_FAILED,
    authorizationStarted,
    authorizationComplete,
    authorizationFailed,
    CONFIRM_EMAIL_STARTED,
    CONFIRM_EMAIL_COMPLETE,
    CONFIRM_EMAIL_FAILED,
    confirmEmailStarted,
    confirmEmailComplete,
    confirmEmailFailed,
    DROP_ERROR,
    dropError,
    RESET_PASSWORD_STARTED,
    RESET_PASSWORD_COMPLETE,
    RESET_PASSWORD_FAILED,
    resetPasswordStarted,
    resetPasswordComplete,
    resetPasswordFailed,
    CHANGE_PASSWORD_STARTED,
    CHANGE_PASSWORD_COMPLETE,
    CHANGE_PASSWORD_FAILED,
    changePasswordStarted,
    changePasswordComplete,
    changePasswordFailed,
};
