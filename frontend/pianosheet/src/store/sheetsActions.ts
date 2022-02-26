import { SheetsClient } from 'api/SheetsClient';
import { AxiosError } from 'axios';
import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
    GenreJsModel,
    GenreItemJsModel,
} from 'domain/api/JsModels';
import { Action } from 'redux';
import { arrToString } from 'utils/arrayTransform';
import { GeneralThunkAction, PayloadedAction } from 'utils/store/actionTypes';
import { RootState } from './rootReducer';
import { SheetsState } from './sheetsReducer';

const ADD_SHEET_STARTED = 'SHEETS/ADD_SHEET_STARTED';
const ADD_SHEET_COMPLETE = 'SHEETS/ADD_SHEET_COMPLETE';
const ADD_SHEET_FAILED = 'SHEETS/ADD_SHEET_FAILED';
function addSheetStarted(): Action {
    return { type: ADD_SHEET_STARTED };
}
function addSheetComplete(sheet: SheetItemJsModel): PayloadedAction<SheetItemJsModel> {
    return { type: ADD_SHEET_COMPLETE, payload: sheet };
}
function addSheetFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: ADD_SHEET_FAILED, payload: { reason, message, error } };
}

function addSheet(sheet: FormData): GeneralThunkAction<void, RootState> {
    return (dispatch) => {
        dispatch(addSheetStarted());
        SheetsClient.addSheet(sheet)
            .then((res) => {
                dispatch(addSheetComplete(res));
            })
            .catch((error) => {
                dispatch(addSheetFailed('', '', error));
                dispatch(errorHandler(error));
            });
    };
}

const ADD_AUTHOR_STARTED = 'SHEETS/ADD_AUTHOR_STARTED';
const ADD_AUTHOR_COMPLETE = 'SHEETS/ADD_AUTHOR_COMPLETE';
const ADD_AUTHOR_FAILED = 'SHEETS/ADD_AUTHOR_FAILED';
function addAuthorStarted(): Action {
    return { type: ADD_AUTHOR_STARTED };
}
function addAuthorComplete(author: AuthorItemJsModel): PayloadedAction<AuthorItemJsModel> {
    return { type: ADD_AUTHOR_COMPLETE, payload: author };
}
function addAuthorFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: ADD_AUTHOR_FAILED, payload: { reason, message, error } };
}

function addAuthor(
    author: FormData,
): GeneralThunkAction<Promise<AuthorItemJsModel | false>, RootState> {
    return (dispatch) => {
        dispatch(addAuthorStarted());
        return SheetsClient.addAuthor(author)
            .then((res) => {
                dispatch(addAuthorComplete(res));
                return res;
            })
            .catch((error) => {
                dispatch(addAuthorFailed('', '', error));
                dispatch(errorHandler(error));

                console.log('error', error.response);
                return false;
            });
    };
}

const GET_SHEETS_STARTED = 'SHEETS/GET_SHEETS_STARTED';
const GET_SHEETS_COMPLETE = 'SHEETS/GET_SHEETS_COMPLETE';
const GET_SHEETS_FAILED = 'SHEETS/GET_SHEETS_FAILED';
function getSheetsStarted(): Action {
    return { type: GET_SHEETS_STARTED };
}
function getSheetsComplete(sheets: SheetJsModel): PayloadedAction<SheetJsModel> {
    return { type: GET_SHEETS_COMPLETE, payload: sheets };
}
function getSheetsFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: GET_SHEETS_FAILED, payload: { reason, message, error } };
}

function getSheets(author_alias?: string, page?: number): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        SheetsClient.getSheets(author_alias, page)
            .then((sheets) => {
                dispatch(getSheetsComplete(sheets));
            })
            .catch((error) => {
                dispatch(getSheetsFailed('', '', error));
            });
    };
}

const GET_AUTHORS_STARTED = 'SHEETS/GET_AUTHORS_STARTED';
const GET_AUTHORS_COMPLETE = 'SHEETS/GET_AUTHORS_COMPLETE';
const GET_AUTHORS_FAILED = 'SHEETS/GET_AUTHORS_FAILED';
function getAuthorsStarted(): Action {
    return { type: GET_AUTHORS_STARTED };
}
function getAuthorsComplete(authors: AuthorJsModel): PayloadedAction<AuthorJsModel> {
    return { type: GET_AUTHORS_COMPLETE, payload: authors };
}
function getAuthorsFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: GET_AUTHORS_FAILED, payload: { reason, message, error } };
}

function getAuthors(letter?: string, page?: number): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(getAuthorsStarted());

        SheetsClient.getAuthors(letter, page)
            .then((authors) => {
                dispatch(getAuthorsComplete(authors));
            })
            .catch((error) => {
                dispatch(getAuthorsFailed('', '', error));
            });
    };
}

const GET_AUTHOR_BY_ALIAS_STARTED = 'SHEETS/GET_AUTHOR_BY_ALIAS_STARTED';
const GET_AUTHOR_BY_ALIAS_COMPLETE = 'SHEETS/GET_AUTHOR_BY_ALIAS_COMPLETE';
const GET_AUTHOR_BY_ALIAS_FAILED = 'SHEETS/GET_AUTHOR_BY_ALIAS_FAILED';
function getAuthorByAliasStarted(): Action {
    return { type: GET_AUTHOR_BY_ALIAS_STARTED };
}
function getAuthorByAliasComplete(author: AuthorJsModel): PayloadedAction<AuthorJsModel> {
    return { type: GET_AUTHOR_BY_ALIAS_COMPLETE, payload: author };
}
function getAuthorByAliasFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return {
        type: GET_AUTHOR_BY_ALIAS_FAILED,
        payload: { reason, message, error },
    };
}

function getAuthor(alias: string): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(getAuthorByAliasStarted());
        SheetsClient.getAuthorByAlias(alias)
            .then((res) => {
                dispatch(getAuthorByAliasComplete(res));
                dispatch(getSheets(res.results[0].alias));
            })
            .catch((error) => {
                dispatch(getAuthorByAliasFailed('', '', error));
            });
    };
}

const EDIT_AUTHOR_STARTED = 'SHEETS/EDIT_AUTHOR_STARTED';
const EDIT_AUTHOR_COMPLETE = 'SHEETS/EDIT_AUTHOR_COMPLETE';
const EDIT_AUTHOR_FAILED = 'SHEETS/EDIT_AUTHOR_FAILED';
function editAuthorStarted(): Action {
    return { type: EDIT_AUTHOR_STARTED };
}
function editAuthorComplete(
    authorId: number,
    author: AuthorItemJsModel,
): PayloadedAction<{ authorId: number; author: AuthorItemJsModel }> {
    return { type: EDIT_AUTHOR_COMPLETE, payload: { authorId, author } };
}
function editAuthorFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: EDIT_AUTHOR_FAILED, payload: { reason, message, error } };
}

function editAuthor(
    authorId: number,
    author: FormData,
): GeneralThunkAction<Promise<AuthorItemJsModel | false>, RootState> {
    return (dispatch) => {
        dispatch(editAuthorStarted());
        return SheetsClient.editAuthorById(authorId, author)
            .then((res) => {
                dispatch(editAuthorComplete(authorId, res));
                return res;
            })
            .catch((error) => {
                dispatch(editAuthorFailed('', '', error));
                dispatch(errorHandler(error));
                return false;
            });
    };
}

const APPLY_SEARCH_STARTED = 'SHEETS/APPLY_SEARCH_STARTED';
const APPLY_SEARCH_COMPLETE = 'SHEETS/APPLY_SEARCH_COMPLETE';
const APPLY_SEARCH_FAILED = 'SHEETS/APPLY_SEARCH_FAILED';
function applySearchStarted(): Action {
    return { type: APPLY_SEARCH_STARTED };
}
function applySearchComplete(
    sheets: SheetJsModel,
    authors: AuthorJsModel,
    searchQuery: string,
): PayloadedAction<{
    sheets: SheetJsModel;
    authors: AuthorJsModel;
    searchQuery: string;
}> {
    return {
        type: APPLY_SEARCH_COMPLETE,
        payload: { sheets, authors, searchQuery },
    };
}
function applySearchFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return {
        type: APPLY_SEARCH_FAILED,
        payload: { reason, message, error },
    };
}

function searchSheets(query: string): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(applySearchStarted());

        Promise.all([SheetsClient.searchSheets(query), SheetsClient.searchAuthors(query)]).then(
            (results) => {
                const sheets = results[0];
                const authors = results[1];
                dispatch(applySearchComplete(sheets, authors, query));
            },
        );
    };
}

const APPLY_SEARCH_SHEETS_COMPLETE = 'SHEETS/APPLY_SEARCH_SHEETS_COMPLETE';
function applySearchSheetsComplete(
    sheets: SheetJsModel,
    searchQuery: string,
): PayloadedAction<{
    sheets: SheetJsModel;
    searchQuery: string;
}> {
    return {
        type: APPLY_SEARCH_SHEETS_COMPLETE,
        payload: { sheets, searchQuery },
    };
}

function searchSheetsByPage(query: string, page: number): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        // dispatch(applySearchStarted());
        SheetsClient.searchSheets(query, page).then((results) => {
            dispatch(applySearchSheetsComplete(results, query));
        });
    };
}

const APPLY_SEARCH_AUTHORS_COMPLETE = 'SHEETS/APPLY_SEARCH_AUTHORS_COMPLETE';
function applySearchAuthorsComplete(
    authors: AuthorJsModel,
    searchQuery: string,
): PayloadedAction<{
    authors: AuthorJsModel;
    searchQuery: string;
}> {
    return {
        type: APPLY_SEARCH_AUTHORS_COMPLETE,
        payload: { authors, searchQuery },
    };
}

function searchAuthorsByPage(query: string, page: number): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        // dispatch(applySearchStarted());
        SheetsClient.searchAuthors(query, page).then((results) => {
            dispatch(applySearchAuthorsComplete(results, query));
        });
    };
}

const DROP_SEARCH_COMPLETE = 'SHEETS/DROP_SEARCH_COMPLETE';
function dropSearchComplete(): Action {
    return { type: DROP_SEARCH_COMPLETE };
}

function dropSearch(): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(dropSearchComplete());
    };
}

const ADD_WARNING = 'SHEETS/ADD_WARNING';
function addWarning(warning: string): PayloadedAction<string> {
    return { type: ADD_WARNING, payload: warning };
}

const CLEAR_WARNING = 'SHEETS/CLEAR_WARNING';
function clearWarning(): Action<string> {
    return { type: CLEAR_WARNING };
}

function errorHandler(e: AxiosError): GeneralThunkAction<void> {
    return (dispatch) => {
        const data = e.response?.data;
        let message = '';

        if (data && Object.keys(data).length > 0) {
            message = Object.keys(data).reduce(
                (sum, field) => sum + `${field}: ${arrToString(data[field])} `,
                '',
            );
        }

        const out = `${message} (${e.response?.status}: ${data.detail || e.response?.statusText})`;

        dispatch(addWarning(out));
        setTimeout(() => dispatch(clearWarning()), 500);
    };
}

const REMOVE_AUTHOR_COMPLETE = 'SHEETS/REMOVE_AUTHOR_COMPLETE';

function removeAuthorComplete(authorId: number): PayloadedAction<number> {
    return { type: REMOVE_AUTHOR_COMPLETE, payload: authorId };
}

function removeAuthor(authorId: number): GeneralThunkAction<void> {
    return (dispatch) => {
        SheetsClient.removeAuthorById(authorId)
            .then((res) => {
                console.log('res', res);
                dispatch(removeAuthorComplete(authorId));
            })
            .catch((error) => {
                dispatch(errorHandler(error));
            });
    };
}

function getTopAuthors(): GeneralThunkAction<void> {
    return (dispatch) => {
        dispatch(getAuthorsStarted());
        SheetsClient.getTopAuthors()
            .then((authors) => {
                dispatch(getAuthorsComplete(authors));
            })
            .catch((error) => {
                dispatch(getAuthorsFailed('', '', error));
            });
    };
}

function getFavoriteAuthors(): GeneralThunkAction<void> {
    return (dispatch) => {
        dispatch(getAuthorsStarted());
        SheetsClient.getFavoriteAuthors()
            .then((authors) => {
                dispatch(getAuthorsComplete(authors));
            })
            .catch((error) => {
                dispatch(getAuthorsFailed('', '', error));
            });
    };
}

function getTopSheets(): GeneralThunkAction<void> {
    return (dispatch) => {
        SheetsClient.getTopSheets()
            .then((sheets) => {
                dispatch(getSheetsComplete(sheets));
            })
            .catch((error) => {
                dispatch(getSheetsFailed('', '', error));
            });
    };
}

function getFavoriteSheets(): GeneralThunkAction<void> {
    return (dispatch) => {
        SheetsClient.getFavoriteSheets()
            .then((sheets) => {
                dispatch(getSheetsComplete(sheets));
            })
            .catch((error) => {
                dispatch(getSheetsFailed('', '', error));
            });
    };
}

function getRandomAuthors(): GeneralThunkAction<void> {
    return (dispatch) => {
        dispatch(getAuthorsStarted());
        SheetsClient.getRandomAuthors()
            .then((authors) => {
                dispatch(getAuthorsComplete(authors));
            })
            .catch((error) => {
                dispatch(getAuthorsFailed('', '', error));
            });
    };
}

function getRandomSheets(): GeneralThunkAction<void> {
    return (dispatch) => {
        SheetsClient.getRandomSheets()
            .then((sheets) => {
                dispatch(getSheetsComplete(sheets));
            })
            .catch((error) => {
                dispatch(getSheetsFailed('', '', error));
            });
    };
}

function getAuthorsByGenreAlias(genreAlias: string, page?: number): GeneralThunkAction<void> {
    return (dispatch) => {
        dispatch(getAuthorsStarted());
        SheetsClient.getAuthorByGenreAlias(genreAlias, page)
            .then((authors) => {
                dispatch(getAuthorsComplete(authors));
            })
            .catch((error) => {
                dispatch(getAuthorsFailed('', '', error));
            });
    };
}

const GET_GENRES_STARTED = 'SHEETS/GET_GENRES_STARTED';
const GET_GENRES_COMPLETE = 'SHEETS/GET_GENRES_COMPLETE';
const GET_GENRES_FAILED = 'SHEETS/GET_GENRES_FAILED';
function getGenresStarted(): Action {
    return { type: GET_GENRES_STARTED };
}
function getGenresComplete(genres: GenreJsModel): PayloadedAction<GenreJsModel> {
    return { type: GET_GENRES_COMPLETE, payload: genres };
}
function getGenresFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: GET_GENRES_FAILED, payload: { reason, message, error } };
}

function getGenres(page?: number): GeneralThunkAction<void> {
    return (dispatch) => {
        dispatch(getGenresStarted());
        SheetsClient.getGenres(page)
            .then((genres) => {
                dispatch(getGenresComplete(genres));
            })
            .catch((error) => {
                dispatch(getGenresFailed('', '', error));
            });
    };
}

const GET_GENRE_STARTED = 'SHEETS/GET_GENRE_STARTED';
const GET_GENRE_COMPLETE = 'SHEETS/GET_GENRE_COMPLETE';
const GET_GENRE_FAILED = 'SHEETS/GET_GENRE_FAILED';
function getGenreStarted(): Action {
    return { type: GET_GENRE_STARTED };
}
function getGenreComplete(genre: GenreItemJsModel): PayloadedAction<GenreItemJsModel> {
    return { type: GET_GENRE_COMPLETE, payload: genre };
}
function getGenreFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: GET_GENRE_FAILED, payload: { reason, message, error } };
}

function getGenreByAlias(genreAlias: string): GeneralThunkAction<void> {
    return (dispatch) => {
        dispatch(getGenreStarted());
        SheetsClient.getGenreByAlias(genreAlias)
            .then((genre) => {
                dispatch(getGenreComplete(genre));
            })
            .catch((error) => {
                dispatch(getGenreFailed('', '', error));
            });
    };
}

const ADD_AUTHOR_TO_FAVORITE_STARTED = 'SHEETS/ADD_AUTHOR_TO_FAVORITE_STARTED';
const ADD_AUTHOR_TO_FAVORITE_COMPLETE = 'SHEETS/ADD_AUTHOR_TO_FAVORITE_COMPLETE';
const ADD_AUTHOR_TO_FAVORITE_FAILED = 'SHEETS/ADD_AUTHOR_TO_FAVORITE_FAILED';
function addAuthorToFavoriteStarted(): Action {
    return { type: ADD_AUTHOR_TO_FAVORITE_STARTED };
}
function addAuthorToFavoriteComplete(
    authorId: number,
    isFavorite: boolean,
): PayloadedAction<{ authorId: number; isFavorite: boolean }> {
    return { type: ADD_AUTHOR_TO_FAVORITE_COMPLETE, payload: { authorId, isFavorite } };
}
function addAuthorToFavoriteFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: ADD_AUTHOR_TO_FAVORITE_FAILED, payload: { reason, message, error } };
}

function addAuthorToFavorite(
    authorId: number,
    isFavorite: boolean,
): GeneralThunkAction<Promise<void>> {
    return (dispatch) => {
        const favorite = new FormData();
        favorite.append('item', `${authorId}`);
        favorite.append('favorite', `${isFavorite}`);

        dispatch(addAuthorToFavoriteStarted());
        return SheetsClient.addAuthorToFavorite(favorite)
            .then(() => {
                addAuthorToFavoriteComplete(authorId, isFavorite);
            })
            .catch((error) => {
                dispatch(addAuthorToFavoriteFailed('', '', error));
                dispatch(errorHandler(error));
            });
    };
}

export const sheetsAction = {
    getSheets,
    getAuthors,
    getAuthor,
    addAuthor,
    addSheet,
    editAuthor,
    searchSheets,
    searchSheetsByPage,
    searchAuthorsByPage,
    dropSearch,
    removeAuthor,
    getTopAuthors,
    getTopSheets,
    getAuthorsByGenreAlias,
    getGenres,
    getGenreByAlias,
    getRandomAuthors,
    getRandomSheets,
    getFavoriteAuthors,
    getFavoriteSheets,
    addAuthorToFavorite,
};

export const sheetsActionTypes = {
    ADD_SHEET_STARTED,
    ADD_SHEET_COMPLETE,
    ADD_SHEET_FAILED,
    addSheetStarted,
    addSheetComplete,
    addSheetFailed,
    ADD_AUTHOR_STARTED,
    ADD_AUTHOR_COMPLETE,
    ADD_AUTHOR_FAILED,
    addAuthorStarted,
    addAuthorComplete,
    addAuthorFailed,
    GET_SHEETS_STARTED,
    GET_SHEETS_COMPLETE,
    GET_SHEETS_FAILED,
    getSheetsStarted,
    getSheetsComplete,
    getSheetsFailed,
    GET_AUTHORS_STARTED,
    GET_AUTHORS_COMPLETE,
    GET_AUTHORS_FAILED,
    getAuthorsStarted,
    getAuthorsComplete,
    getAuthorsFailed,
    GET_AUTHOR_BY_ALIAS_STARTED,
    GET_AUTHOR_BY_ALIAS_COMPLETE,
    GET_AUTHOR_BY_ALIAS_FAILED,
    getAuthorByAliasStarted,
    getAuthorByAliasComplete,
    getAuthorByAliasFailed,
    APPLY_SEARCH_STARTED,
    APPLY_SEARCH_COMPLETE,
    APPLY_SEARCH_FAILED,
    applySearchStarted,
    applySearchComplete,
    applySearchFailed,
    APPLY_SEARCH_SHEETS_COMPLETE,
    applySearchSheetsComplete,
    APPLY_SEARCH_AUTHORS_COMPLETE,
    applySearchAuthorsComplete,
    DROP_SEARCH_COMPLETE,
    dropSearchComplete,
    ADD_WARNING,
    addWarning,
    CLEAR_WARNING,
    EDIT_AUTHOR_STARTED,
    EDIT_AUTHOR_COMPLETE,
    EDIT_AUTHOR_FAILED,
    editAuthorStarted,
    editAuthorComplete,
    editAuthorFailed,
    REMOVE_AUTHOR_COMPLETE,
    removeAuthorComplete,
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
};
