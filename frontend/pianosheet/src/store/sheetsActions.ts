import { SheetsClient } from 'api/SheetsClient';
import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
} from 'domain/api/JsModels';
import { Action } from 'redux';
import { GeneralThunkAction, PayloadedAction } from 'utils/store/actionTypes';
import { RootState } from './rootReducer';
import { SheetsState } from './sheetsReducer';
import { AuthorsMock, SheetsMock } from 'mockData/allMocks';

const ADD_SHEET_STARTED = 'SHEETS/ADD_SHEET_STARTED';
const ADD_SHEET_COMPLETE = 'SHEETS/ADD_SHEET_COMPLETE';
const ADD_SHEET_FAILED = 'SHEETS/ADD_SHEET_FAILED';
function addSheetStarted(): Action {
    return { type: ADD_SHEET_STARTED };
}
function addSheetComplete(
    sheet: SheetItemJsModel,
): PayloadedAction<{ sheet: SheetItemJsModel }> {
    return { type: ADD_SHEET_COMPLETE, payload: { sheet } };
}
function addSheetFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: ADD_SHEET_FAILED, payload: { reason, message, error } };
}

const ADD_AUTHOR_STARTED = 'SHEETS/ADD_AUTHOR_STARTED';
const ADD_AUTHOR_COMPLETE = 'SHEETS/ADD_AUTHOR_COMPLETE';
const ADD_AUTHOR_FAILED = 'SHEETS/ADD_AUTHOR_FAILED';
function addAuthorStarted(): Action {
    return { type: ADD_AUTHOR_STARTED };
}
function addAuthorComplete(
    author: AuthorItemJsModel,
): PayloadedAction<{ author: AuthorItemJsModel }> {
    return { type: ADD_AUTHOR_COMPLETE, payload: { author } };
}
function addAuthorFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: ADD_AUTHOR_FAILED, payload: { reason, message, error } };
}

const GET_SHEETS_STARTED = 'SHEETS/GET_SHEETS_STARTED';
const GET_SHEETS_COMPLETE = 'SHEETS/GET_SHEETS_COMPLETE';
const GET_SHEETS_FAILED = 'SHEETS/GET_SHEETS_FAILED';
function getSheetsStarted(): Action {
    return { type: GET_SHEETS_STARTED };
}
function getSheetsComplete(
    sheets: SheetJsModel,
): PayloadedAction<{ sheets: SheetJsModel }> {
    return { type: GET_SHEETS_COMPLETE, payload: { sheets } };
}
function getSheetsFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: GET_SHEETS_FAILED, payload: { reason, message, error } };
}

const GET_AUTHORS_STARTED = 'SHEETS/GET_AUTHORS_STARTED';
const GET_AUTHORS_COMPLETE = 'SHEETS/GET_AUTHORS_COMPLETE';
const GET_AUTHORS_FAILED = 'SHEETS/GET_AUTHORS_FAILED';
function getAuthorsStarted(): Action {
    return { type: GET_AUTHORS_STARTED };
}
function getAuthorsComplete(
    authors: AuthorJsModel,
): PayloadedAction<{ authors: AuthorJsModel }> {
    return { type: GET_AUTHORS_COMPLETE, payload: { authors } };
}
function getAuthorsFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return { type: GET_AUTHORS_FAILED, payload: { reason, message, error } };
}

const GET_AUTHOR_BY_ALIAS_STARTED = 'SHEETS/GET_AUTHOR_BY_ALIAS_STARTED';
const GET_AUTHOR_BY_ALIAS_COMPLETE = 'SHEETS/GET_AUTHOR_BY_ALIAS_COMPLETE';
const GET_AUTHOR_BY_ALIAS_FAILED = 'SHEETS/GET_AUTHOR_BY_ALIAS_FAILED';
function getAuthorsByAliasStarted(): Action {
    return { type: GET_AUTHOR_BY_ALIAS_STARTED };
}
function getAuthorsByAliasComplete(
    author: AuthorJsModel,
): PayloadedAction<{ author: AuthorJsModel }> {
    return { type: GET_AUTHOR_BY_ALIAS_COMPLETE, payload: { author } };
}
function getAuthorsByAliasFailed(
    reason: string,
    message: string,
    error: Error,
): PayloadedAction<{ reason: string; message: string; error: Error }> {
    return {
        type: GET_AUTHOR_BY_ALIAS_FAILED,
        payload: { reason, message, error },
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

const DROP_SEARCH_COMPLETE = 'SHEETS/DROP_SEARCH_COMPLETE';
function dropSearchComplete(): Action {
    return { type: DROP_SEARCH_COMPLETE };
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
            });
    };
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
                return false;
            });
    };
}

function getSheets(
    author_alias?: string,
    page?: number,
): GeneralThunkAction<void, SheetsState> {
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

function getAuthors(
    letter?: string,
    page?: number,
): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        if (!page) dispatch(getAuthorsStarted());

        SheetsClient.getAuthors(letter, page)
            .then((authors) => {
                dispatch(getAuthorsComplete(authors));
            })
            .catch((error) => {
                dispatch(getAuthorsFailed('', '', error));
            });
    };
}

function getAuthor(alias: string): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(getAuthorsByAliasStarted());
        SheetsClient.getAuthorByAlias(alias)
            .then((res) => {
                dispatch(getAuthorsByAliasComplete(res));
                dispatch(getSheets(res.results[0].alias));
            })
            .catch((error) => {
                dispatch(getAuthorsByAliasFailed('', '', error));
            });
    };
}

function searchSheets(query: string): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(applySearchStarted());

        Promise.all([
            SheetsClient.searchSheets(query),
            SheetsClient.searchAuthors(query),
        ]).then((results) => {
            const sheets = results[0];
            const authors = results[1];
            dispatch(applySearchComplete(sheets, authors, query));
        });
    };
}

function searchSheetsByPage(
    query: string,
    page: number,
): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        // dispatch(applySearchStarted());
        SheetsClient.searchSheets(query, page).then((results) => {
            dispatch(applySearchSheetsComplete(results, query));
        });
    };
}

function searchAuthorsByPage(
    query: string,
    page: number,
): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        // dispatch(applySearchStarted());
        SheetsClient.searchAuthors(query, page).then((results) => {
            dispatch(applySearchAuthorsComplete(results, query));
        });
    };
}

function dropSearch(): GeneralThunkAction<void, SheetsState> {
    return (dispatch) => {
        dispatch(dropSearchComplete());
    };
}

export const sheetsAction = {
    getSheets,
    getAuthors,
    getAuthor,
    addAuthor,
    addSheet,
    searchSheets,
    searchSheetsByPage,
    searchAuthorsByPage,
    dropSearch,
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
    getAuthorsByAliasStarted,
    getAuthorsByAliasComplete,
    getAuthorsByAliasFailed,
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
};
