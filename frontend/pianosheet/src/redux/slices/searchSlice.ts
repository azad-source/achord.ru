import { createSlice } from '@reduxjs/toolkit';
import { TagsEnum, api } from 'redux/api';
import { RootState } from 'redux/store';

export interface SearchState {
    query: string;
    applied: boolean;
}

const initialState: SearchState = { applied: false, query: '' };

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addSearch: (state, { payload }: { payload: SearchState }) => {
            state.applied = payload.applied;
            state.query = payload.query;
        },
        dropSearch: (state) => {
            api.util.invalidateTags([TagsEnum.SearchAuthors, TagsEnum.SearchSheets]);
            state.applied = false;
            state.query = '';
        },
    },
});

export const { addSearch, dropSearch } = searchSlice.actions;

export const searchSelector = (state: RootState) => state.search;

export default searchSlice.reducer;
