import { Action } from 'redux';
import { QueryStatus } from 'domain/QueryStatus';
import { sheetsActionTypes } from './sheetsActions';
import produce from 'immer';
import {
    AuthorJsModel,
    AuthorItemJsModel,
    SheetJsModel,
    SheetItemJsModel,
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
};

export const defaultAuthor: AuthorJsModel = {
    count: 0,
    page_count: 0,
    page_size: 20,
    next: '',
    previous: '',
    results: [],
};

export const defaultSheetItem: SheetItemJsModel = {
    id: 0,
    name: '',
    author: 0,
    filename: '',
    savedate: '',
    rate: 0,
};

export const defaultSheet: SheetJsModel = {
    count: 0,
    page_count: 0,
    page_size: 20,
    next: '',
    previous: '',
    results: [],
};

const sheetsDefaultState: SheetsState = {
    sheets: defaultSheet,
    authors: defaultAuthor,
    viewAuthor: defaultAuthorItem,
    total: 0,
    status: QueryStatus.initial(),
    search: { ...defaultSearch },
    warning: '',
};

export interface SheetsState {
    sheets: SheetJsModel;
    authors: AuthorJsModel;
    viewAuthor: AuthorItemJsModel;
    total: number;
    status: QueryStatus;
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
    getAuthorsByAliasComplete,
    getAuthorsByAliasFailed,
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
} = sheetsActionTypes;

export function sheetsReducer(
    state: SheetsState = sheetsDefaultState,
    action: Action,
): SheetsState {
    switch (action.type) {
        case ADD_SHEET_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case ADD_SHEET_COMPLETE: {
            const {
                payload: { sheet },
            } = action as ReturnType<typeof addSheetComplete>;
            return produce(state, (draft) => {
                draft.sheets.results = [...draft.sheets.results, sheet];
                draft.status = QueryStatus.success();
            });
        }
        case ADD_SHEET_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof addSheetFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }
        case ADD_AUTHOR_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case ADD_AUTHOR_COMPLETE: {
            const {
                payload: { author },
            } = action as ReturnType<typeof addAuthorComplete>;
            return produce(state, (draft) => {
                draft.authors.results = [...draft.authors.results, author];
                draft.status = QueryStatus.success();
            });
        }
        case ADD_AUTHOR_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof addAuthorFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
            });
        }
        case GET_SHEETS_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
            });
        }
        case GET_SHEETS_COMPLETE: {
            const {
                payload: { sheets },
            } = action as ReturnType<typeof getSheetsComplete>;
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
            });
        }
        case GET_AUTHORS_COMPLETE: {
            const {
                payload: { authors },
            } = action as ReturnType<typeof getAuthorsComplete>;
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
                draft.viewAuthor = defaultAuthorItem;
            });
        }
        case GET_AUTHOR_BY_ALIAS_COMPLETE: {
            const {
                payload: { author },
            } = action as ReturnType<typeof getAuthorsByAliasComplete>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.success();
                draft.viewAuthor = author.results[0];
            });
        }
        case GET_AUTHOR_BY_ALIAS_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof getAuthorsByAliasFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
                draft.viewAuthor = defaultAuthorItem;
            });
        }

        case EDIT_AUTHOR_STARTED: {
            return produce(state, (draft) => {
                draft.status = QueryStatus.request();
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
                draft.status = QueryStatus.success();
            });
        }
        case EDIT_AUTHOR_FAILED: {
            const {
                payload: { reason, message, error },
            } = action as ReturnType<typeof editAuthorFailed>;
            return produce(state, (draft) => {
                draft.status = QueryStatus.error(reason, message, error);
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

        default: {
            return state;
        }
    }
}
