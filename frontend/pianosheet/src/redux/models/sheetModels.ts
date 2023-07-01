export interface SheetsRequest {
    authorAlias?: string;
    page?: number;
}

export interface SheetByIdRequest {
    noteId?: string;
}

export interface SheetsByGenreRequest {
    genre_alias: string;
    page?: number;
}

export interface AddSheetRequest {
    sheetname: string;
    filename: any;
    authorId: number;
}

export interface AddSheetToFavoriteRequest {
    sheetId: number;
    isFavorite: boolean;
}

export interface AddLikeToSheetRequest {
    sheetId: number;
    hasLike: boolean;
}
