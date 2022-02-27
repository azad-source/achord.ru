import { Action } from 'redux';
import { QueryStatus } from 'domain/QueryStatus';
import { sheetsActionTypes } from './sheetsActions';
import produce from 'immer';
import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
    GenreJsModel,
    GenreItemJsModel,
} from 'domain/api/JsModels';

export interface SearchApiResults {
    status: QueryStatus;
    applied: boolean;
    sheets: SheetJsModel;
    authors: AuthorJsModel;
    query: string;
}

const defaultSearch = {
    applied: false,
    status: QueryStatus.initial(),
    sheets: {} as SheetJsModel,
    authors: {} as AuthorJsModel,
    query: '',
};

export const defaultAuthorItem: AuthorItemJsModel = {
    id: 0,
    name: '',
    alias: '',
    info: '',
    preview: '',
    preview_s: '',
    preview_xs: '',
    rate: 0,
    genres: [],
    owner: 0,
    favorite: false,
    like: false,
    like_count: 0,
};

export const defaultSheetItem: SheetItemJsModel = {
    id: 0,
    name: '',
    author: 0,
    filename: '',
    savedate: '',
    rate: 0,
    favorite: false,
    like: false,
    like_count: 0,
};

export const defaultGenreItem: GenreItemJsModel = {
    id: 0,
    name: '',
    alias: '',
};

export const defaultPaged = {
    count: 0,
    page_count: 0,
    page_size: 20,
    next: '',
    previous: '',
    results: [],
};

const sheetsDefaultState: SheetsState = {
    sheets: defaultPaged,
    authors: defaultPaged,
    genres: defaultPaged,
    genre: defaultGenreItem,
    author: defaultAuthorItem,
    total: 0,
    status: QueryStatus.initial(),
    localStatus: QueryStatus.initial(),
    search: { ...defaultSearch },
    warning: '',
};

export interface SheetsState {
    sheets: SheetJsModel;
    authors: AuthorJsModel;
    author: AuthorItemJsModel;
    genres: GenreJsModel;
    genre: GenreItemJsModel;
    total: number;
    status: QueryStatus;
    localStatus: QueryStatus;
    search: SearchApiResults;
    warning: string;
}

const {
    ADD_SHEET_STARTED,
    ADD_SHEET_COMPLETE,
    ADD_SHEET_FAILED,
    addSheetComplete,
    addSheetFailed,
    ADD_AUTHOR_STARTED,
    ADD_AUTHOR_COMPLETE,
    ADD_AUTHOR_FAILED,
    addAuthorComplete,
    addAuthorFailed,
    GET_SHEETS_STARTED,
    GET_SHEETS_COMPLETE,
    GET_SHEETS_FAILED,
    getSheetsComplete,
    getSheetsFailed,
    GET_AUTHORS_STARTED,
    GET_AUTHORS_COMPLETE,
    GET_AUTHORS_FAILED,
    getAuthorsComplete,
    getAuthorsFailed,
    GET_AUTHOR_BY_ALIAS_STARTED,
    GET_AUTHOR_BY_ALIAS_COMPLETE,
    GET_AUTHOR_BY_ALIAS_FAILED,
    getAuthorByAliasComplete,
    getAuthorByAliasFailed,
    APPLY_SEARCH_STARTED,
    APPLY_SEARCH_COMPLETE,
    APPLY_SEARCH_FAILED,
    applySearchComplete,
    applySearchFailed,
    APPLY_SEARCH_SHEETS_COMPLETE,
    applySearchSheetsComplete,
    APPLY_SEARCH_AUTHORS_COMPLETE,
    applySearchAuthorsComplete,
    DROP_SEARCH_COMPLETE,
    ADD_WARNING,
    addWarning,
    CLEAR_WARNING,
    EDIT_AUTHOR_STARTED,
    EDIT_AUTHOR_COMPLETE,
    EDIT_AUTHOR_FAILED,
    editAuthorComplete,
    editAuthorFailed,
    REMOVE_AUTHOR_STARTED,
    REMOVE_AUTHOR_COMPLETE,
    REMOVE_AUTHOR_FAILED,
    removeAuthorComplete,
    removeAuthorFailed,
    GET_GENRES_STARTED,
    GET_GENRES_COMPLETE,
    GET_GENRES_FAILED,
    getGenresComplete,
    getGenresFailed,
    GET_GENRE_STARTED,
    GET_GENRE_COMPLETE,
    GET_GENRE_FAILED,
    getGenreComplete,
    getGenreFailed,
    ADD_AUTHOR_TO_FAVORITE_STARTED,
    ADD_AUTHOR_TO_FAVORITE_COMPLETE,
    ADD_AUTHOR_TO_FAVORITE_FAILED,
    addAuthorToFavoriteComplete,
    addAuthorToFavoriteFailed,
    LIKE_AUTHOR_STARTED,
    LIKE_AUTHOR_COMPLETE,
    LIKE_AUTHOR_FAILED,
    likeAuthorComplete,
    likeAuthorFailed,
    ADD_SHEET_TO_FAVORITE_STARTED,
    ADD_SHEET_TO_FAVORITE_COMPLETE,
    ADD_SHEET_TO_FAVORITE_FAILED,
    addSheetToFavoriteComplete,
    addSheetToFavoriteFailed,
    LIKE_SHEET_STARTED,
    LIKE_SHEET_COMPLETE,
    LIKE_SHEET_FAILED,
    likeSheetComplete,
    likeSheetFailed,
} = sheetsActionTypes;

export function sheetsReducer(
    state: SheetsState = sheetsDefaultState,
    action: Action,
): SheetsState {
    switch (action.type) {
        case ADD_SHEET_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case ADD_SHEET_COMPLETE: {
            const { payload: sheet } = action as ReturnType<typeof addSheetComplete>;
            return produce(state, (draft) => {
                draft.sheets.results = [...draft.sheets.results, sheet];
                draft.localStatus = QueryStatus.success();
            });
        }
        case ADD_SHEET_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof addSheetFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }
        case ADD_AUTHOR_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case ADD_AUTHOR_COMPLETE: {
            const { payload: author } = action as ReturnType<typeof addAuthorComplete>;
            return produce(state, (draft) => {
                draft.authors.results = [...draft.authors.results, author];
                draft.localStatus = QueryStatus.success();
            });
        }
        case ADD_AUTHOR_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof addAuthorFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }
        case GET_SHEETS_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
                draft.sheets = defaultPaged;
            });
        }
        case GET_SHEETS_COMPLETE: {
            const { payload: sheets } = action as ReturnType<typeof getSheetsComplete>;
            return produce(state, (draft) => {
                draft.sheets = sheets;
                draft.status = QueryStatus.success();
            });
        }
        case GET_SHEETS_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getSheetsFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }
        case GET_AUTHORS_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
                draft.authors = defaultPaged;
            });
        }
        case GET_AUTHORS_COMPLETE: {
            const { payload: authors } = action as ReturnType<typeof getAuthorsComplete>;
            return produce(state, (draft) => {
                draft.authors = authors;
                draft.status = QueryStatus.success();
            });
        }
        case GET_AUTHORS_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getAuthorsFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }
        case GET_AUTHOR_BY_ALIAS_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
                draft.author = defaultAuthorItem;
            });
        }
        case GET_AUTHOR_BY_ALIAS_COMPLETE: {
            const { payload: author } = action as ReturnType<typeof getAuthorByAliasComplete>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
                draft.author = author.results[0];
            });
        }
        case GET_AUTHOR_BY_ALIAS_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getAuthorByAliasFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
                draft.author = defaultAuthorItem;
            });
        }

        case EDIT_AUTHOR_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case EDIT_AUTHOR_COMPLETE: {
            const {
                payload: { authorId, author },
            } = action as ReturnType<typeof editAuthorComplete>;
            return produce(state, (draft) => {
                const modifed = draft.authors.results.map((item) =>
                    item.id === authorId ? author : item,
                );

                draft.authors.results = modifed;
                draft.localStatus = QueryStatus.success();
            });
        }
        case EDIT_AUTHOR_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof editAuthorFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }

        case APPLY_SEARCH_STARTED: {
            return produce(state, (draft) => {
                draft.search.status = QueryStatus.request();
            });
        }
        case APPLY_SEARCH_COMPLETE: {
            const {
                payload: { sheets, authors, searchQuery },
            } = action as ReturnType<typeof applySearchComplete>;
            return produce(state, (draft) => {
                draft.search.status = QueryStatus.success();
                draft.search.sheets = sheets;
                draft.search.authors = authors;
                draft.search.applied = true;
                draft.search.query = searchQuery;
            });
        }
        case APPLY_SEARCH_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof applySearchFailed>;
            return produce(state, (draft) => {
                draft.search.status = QueryStatus.error(reason, message, error);
                draft.search.applied = false;
            });
        }

        case APPLY_SEARCH_SHEETS_COMPLETE: {
            const {
                payload: { sheets, searchQuery },
            } = action as ReturnType<typeof applySearchSheetsComplete>;
            return produce(state, (draft) => {
                draft.search.status = QueryStatus.success();
                draft.search.sheets = sheets;
                draft.search.applied = true;
                draft.search.query = searchQuery;
            });
        }

        case APPLY_SEARCH_AUTHORS_COMPLETE: {
            const {
                payload: { authors, searchQuery },
            } = action as ReturnType<typeof applySearchAuthorsComplete>;
            return produce(state, (draft) => {
                draft.search.status = QueryStatus.success();
                draft.search.authors = authors;
                draft.search.applied = true;
                draft.search.query = searchQuery;
            });
        }

        case DROP_SEARCH_COMPLETE: {
            return produce(state, (draft) => {
                draft.search = defaultSearch;
            });
        }

        case ADD_WARNING: {
            const { payload: warning } = action as ReturnType<typeof addWarning>;
            return produce(state, (draft) => {
                draft.warning = warning;
            });
        }
        case CLEAR_WARNING: {
            return produce(state, (draft) => {
                draft.warning = '';
            });
        }

        case REMOVE_AUTHOR_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case REMOVE_AUTHOR_COMPLETE: {
            const { payload: authorId } = action as ReturnType<typeof removeAuthorComplete>;
            return produce(state, (draft) => {
                draft.authors.results = draft.authors.results.filter(
                    (item) => item.id !== authorId,
                );
                draft.localStatus = QueryStatus.success();
            });
        }
        case REMOVE_AUTHOR_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof removeAuthorFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }

        case GET_GENRES_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
                draft.genres = defaultPaged;
            });
        }
        case GET_GENRES_COMPLETE: {
            const { payload: genres } = action as ReturnType<typeof getGenresComplete>;
            return produce(state, (draft) => {
                draft.genres = genres;
                draft.status = QueryStatus.success();
            });
        }
        case GET_GENRES_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getGenresFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case GET_GENRE_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
                draft.genre = defaultGenreItem;
            });
        }
        case GET_GENRE_COMPLETE: {
            const { payload: genre } = action as ReturnType<typeof getGenreComplete>;
            return produce(state, (draft) => {
                draft.genre = genre;
                draft.status = QueryStatus.success();
            });
        }
        case GET_GENRE_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getGenreFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }

        case ADD_AUTHOR_TO_FAVORITE_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case ADD_AUTHOR_TO_FAVORITE_COMPLETE: {
            const {
                payload: { authorId, isFavorite },
            } = action as ReturnType<typeof addAuthorToFavoriteComplete>;
            return produce(state, (draft) => {
                if (draft.author.id === authorId) {
                    draft.author.favorite = isFavorite;
                }
                draft.authors.results.forEach(({ id }, index) => {
                    if (id === authorId) {
                        draft.authors.results[index].favorite = isFavorite;
                    }
                });

                draft.localStatus = QueryStatus.success();
            });
        }
        case ADD_AUTHOR_TO_FAVORITE_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof addAuthorToFavoriteFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }

        case LIKE_AUTHOR_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case LIKE_AUTHOR_COMPLETE: {
            const {
                payload: { authorId, hasLike },
            } = action as ReturnType<typeof likeAuthorComplete>;
            return produce(state, (draft) => {
                if (draft.author.id === authorId) {
                    draft.author.like = hasLike;
                    draft.author.like_count = draft.author.like_count + (hasLike ? 1 : -1);
                }
                draft.authors.results.forEach(({ id }, index) => {
                    if (id === authorId) {
                        draft.authors.results[index].like = hasLike;
                        draft.authors.results[index].like_count =
                            draft.authors.results[index].like_count + (hasLike ? 1 : -1);
                    }
                });

                draft.localStatus = QueryStatus.success();
            });
        }
        case LIKE_AUTHOR_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof likeAuthorFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }

        case ADD_SHEET_TO_FAVORITE_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case ADD_SHEET_TO_FAVORITE_COMPLETE: {
            const {
                payload: { sheetId, isFavorite },
            } = action as ReturnType<typeof addSheetToFavoriteComplete>;
            return produce(state, (draft) => {
                draft.sheets.results.forEach(({ id }, index) => {
                    if (id === sheetId) {
                        draft.sheets.results[index].favorite = isFavorite;
                    }
                });

                draft.localStatus = QueryStatus.success();
            });
        }
        case ADD_SHEET_TO_FAVORITE_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof addSheetToFavoriteFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }

        case LIKE_SHEET_STARTED: {
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.request();
            });
        }
        case LIKE_SHEET_COMPLETE: {
            const {
                payload: { sheetId, hasLike },
            } = action as ReturnType<typeof likeSheetComplete>;
            return produce(state, (draft) => {
                draft.sheets.results.forEach(({ id }, index) => {
                    if (id === sheetId) {
                        draft.sheets.results[index].like = hasLike;
                        draft.sheets.results[index].like_count =
                            draft.sheets.results[index].like_count + (hasLike ? 1 : -1);
                    }
                });

                draft.localStatus = QueryStatus.success();
            });
        }
        case LIKE_SHEET_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof likeSheetFailed>;
            return produce(state, (draft) => {
                draft.localStatus = QueryStatus.error(reason, message, error);
            });
        }

        default: {
            return state;
        }
    }
}
