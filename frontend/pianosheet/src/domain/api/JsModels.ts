export type TokenJsModel = {
    accessToken: string;
    refreshToken: string;
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
    genres: GenreResultJsModel[];
    owner: number;
};

export type AuthorJsModel = {
    count: number;
    page_count: number;
    page_size: number;
    next: string;
    previous: string;
    results: AuthorItemJsModel[];
};

export type SheetItemJsModel = {
    id: number;
    name: string;
    filename: string;
    author: number;
    savedate: string;
    rate: number;
};

export type SheetJsModel = {
    count: number;
    page_count: number;
    page_size: number;
    next: string;
    previous: string;
    results: SheetItemJsModel[];
};

export type SocialLinkJsModel = {
    link: string;
    provider: string;
};

export type UserJsModel = {
    uid?: string;
    email?: string;
    activate?: boolean;
    token?: string;
};

export type GenreJsModel = {
    count: number;
    page_count: number;
    page_size: number;
    next: string;
    previous: string;
    results: GenreResultJsModel[];
};

export type GenreResultJsModel = {
    id: number;
    name: string;
    alias: string;
};
