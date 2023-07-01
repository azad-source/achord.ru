import { createSlice } from '@reduxjs/toolkit';
import { AuthorJsModel, SheetJsModel } from 'domain/api/JsModels';
import { TagsEnum, api } from 'redux/api';
import { RootState } from 'redux/store';
import { blankPagedResult, blankSearch } from 'utils/constants';

export interface SearchState {
    sheets: SheetJsModel;
    authors: AuthorJsModel;
    query: string;
    applied: boolean;
}

const initialState: SearchState = { ...blankSearch };

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addSearch: (state, { payload }: { payload: SearchState }) => {
            state.applied = payload.applied;
            state.query = payload.query;
            state.authors = payload.authors;
            state.sheets = payload.sheets;
        },
        dropSearch: (state) => {
            api.util.invalidateTags([TagsEnum.SearchAuthors, TagsEnum.SearchSheets]);
            state.applied = false;
            state.authors = { ...blankPagedResult };
            state.sheets = { ...blankPagedResult };
            state.query = '';
        },
    },
});

export const { addSearch, dropSearch } = searchSlice.actions;

export const searchSelector = (state: RootState) => state.search;

export default searchSlice.reducer;
