import { Action } from 'redux';
import { QueryStatus } from 'domain/QueryStatus';
import { UserJsModel } from 'domain/api/JsModels';
import { usersActionTypes } from './usersActions';
import produce from 'immer';

const usersDefaultState: UsersState = {
    currentUser: { id: null },
    status: QueryStatus.initial(),
};

export interface UsersState {
    currentUser: UserJsModel;
    status: QueryStatus;
}

const {
    REGISTRATION_STARTED,
    REGISTRATION_COMPLETE,
    REGISTRATION_FAILED,
    registrationComplete,
    registrationFailed,
    AUTHORIZATION_STARTED,
    AUTHORIZATION_COMPLETE,
    AUTHORIZATION_FAILED,
    authorizationComplete,
    authorizationFailed,
    CONFIRM_EMAIL_STARTED,
    CONFIRM_EMAIL_COMPLETE,
    CONFIRM_EMAIL_FAILED,
    confirmEmailComplete,
    confirmEmailFailed,
    DROP_ERROR,
    RESET_PASSWORD_STARTED,
    RESET_PASSWORD_COMPLETE,
    RESET_PASSWORD_FAILED,
    resetPasswordFailed,
    CHANGE_PASSWORD_STARTED,
    CHANGE_PASSWORD_COMPLETE,
    CHANGE_PASSWORD_FAILED,
    changePasswordFailed,
    GET_CURRENT_USER_STARTED,
    GET_CURRENT_USER_COMPLETE,
    GET_CURRENT_USER_FAILED,
    getCurrentUserComplete,
    getCurrentUserFailed,
} = usersActionTypes;

export function usersReducer(state: UsersState = usersDefaultState, action: Action): UsersState {
    switch (action.type) {
        case REGISTRATION_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case REGISTRATION_COMPLETE: {
            const { user } = action as ReturnType<typeof registrationComplete>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
                draft.currentUser = user;
            });
        }
        case REGISTRATION_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof registrationFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case AUTHORIZATION_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case AUTHORIZATION_COMPLETE: {
            const { user } = action as ReturnType<typeof authorizationComplete>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
                draft.currentUser = user;
            });
        }
        case AUTHORIZATION_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof authorizationFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case CONFIRM_EMAIL_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case CONFIRM_EMAIL_COMPLETE: {
            const { user } = action as ReturnType<typeof confirmEmailComplete>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
                draft.currentUser = user;
            });
        }
        case CONFIRM_EMAIL_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof confirmEmailFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case DROP_ERROR: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.initial();
            });
        }

        case RESET_PASSWORD_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case RESET_PASSWORD_COMPLETE: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
            });
        }
        case RESET_PASSWORD_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof resetPasswordFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case CHANGE_PASSWORD_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case CHANGE_PASSWORD_COMPLETE: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
            });
        }
        case CHANGE_PASSWORD_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof changePasswordFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case GET_CURRENT_USER_STARTED: {
            return produce(state, (draft) => {
                draft.currentUser = { id: null };
            });
        }
        case GET_CURRENT_USER_COMPLETE: {
            const { payload: user } = action as ReturnType<typeof getCurrentUserComplete>;
            return produce(state, (draft) => {
                draft.currentUser = user;
            });
        }
        case GET_CURRENT_USER_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getCurrentUserFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        default: {
            return state;
        }
    }
}
