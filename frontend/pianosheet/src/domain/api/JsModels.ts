export type TokenJsModel = {
    accessToken: string;
    refreshToken: string;
};

export type UserJsModel = {
    id: Nullable<string>;
    is_superuser?: boolean;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    email?: string;
    activate?: boolean;
    token?: string;
};

export type SocialLinksJsModel = {
    google: SocialAuthParams;
};

export type SocialAuthParams = {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope: string;
};

export type PagedJsModel<T> = {
    count: number;
    page_count: number;
    page_size: number;
    next: string;
    previous: string;
    results: T[];
};

export type AuthorItemJsModel = {
    id: number;
    name: string;
    info?: string;
    preview?: string;
    preview_s?: string;
    preview_xs?: string;
    alias: string;
    rate: number;
    genres: GenreItemJsModel[];
    owner: number;
};

export type SheetItemJsModel = {
    id: number;
    name: string;
    filename: string;
    author: number;
    savedate: string;
    rate: number;
};

export type GenreItemJsModel = {
    id: number;
    name: string;
    alias: string;
};

export type AuthorJsModel = PagedJsModel<AuthorItemJsModel>;

export type SheetJsModel = PagedJsModel<SheetItemJsModel>;

export type GenreJsModel = PagedJsModel<GenreItemJsModel>;

export type AuthorRequestModel = {
    name: string;
    info: string;
    preview: any;
    genres: GenreItemJsModel[];
};

export const defaultAuthorRequestModel = {
    name: '',
    info: '',
    preview: '',
    genres: [],
};
