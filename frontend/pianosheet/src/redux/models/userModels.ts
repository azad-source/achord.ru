export interface CustomHeaders {
    Authorization?: Nullable<string>;
    'Content-Type'?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    rePassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginGoogleRequest {
    accessToken: string;
}

export interface AccountActivationRequest {
    userId: string;
    token: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ChangePasswordRequest {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
}
