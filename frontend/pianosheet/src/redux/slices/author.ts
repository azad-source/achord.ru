import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AuthorItemJsModel, AuthorJsModel } from 'domain/api/JsModels';
import { QueryStatus } from 'domain/QueryStatus';
import { errorData } from 'redux/api/apiConfig';
import { AuthorClient } from 'redux/api/AuthorClient';
import { blankAuthorItem, blankPagedResult } from 'utils/constants';

export interface AuthorState {
    list: AuthorJsModel;
    current?: AuthorItemJsModel;
    status: QueryStatus;
    query: string;
    applied: boolean;
}

const initialState: AuthorState = {
    list: { ...blankPagedResult },
    status: QueryStatus.initial(),
    query: '',
    applied: false,
};

interface GetAuthorsProps {
    letter?: string;
    page?: number;
}

export const getAuthors = createAsyncThunk<
    AuthorJsModel,
    GetAuthorsProps | undefined,
    { rejectValue: AxiosError }
>('author/getAuthors', async ({ letter, page } = {}) => {
    try {
        const response = await AuthorClient.getAuthors(letter, page);
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getTopAuthors = createAsyncThunk<
    AuthorJsModel,
    undefined,
    { rejectValue: AxiosError }
>('author/getTopAuthors', async () => {
    try {
        const response = await AuthorClient.getTopAuthors();
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getFavoriteAuthors = createAsyncThunk<
    AuthorJsModel,
    undefined,
    { rejectValue: AxiosError }
>('author/getFavoriteAuthors', async () => {
    try {
        const response = await AuthorClient.getFavoriteAuthors();
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getRandomAuthors = createAsyncThunk<
    AuthorJsModel,
    undefined,
    { rejectValue: AxiosError }
>('author/getRandomAuthors', async () => {
    try {
        const response = await AuthorClient.getRandomAuthors();
        return response;
    } catch (err: any) {
        return err;
    }
});

interface GetAuthorsByGenreAliasProps {
    genreAlias: string;
    page?: number;
}

export const getAuthorsByGenreAlias = createAsyncThunk<
    AuthorJsModel,
    GetAuthorsByGenreAliasProps,
    { rejectValue: AxiosError }
>('author/getAuthorsByGenreAlias', async ({ genreAlias, page }) => {
    try {
        const response = await AuthorClient.getAuthorByGenreAlias(genreAlias, page);
        return response;
    } catch (err: any) {
        return err;
    }
});

export const getAuthor = createAsyncThunk<AuthorJsModel, string, { rejectValue: AxiosError }>(
    'author/getAuthor',
    async (alias) => {
        try {
            const response = await AuthorClient.getAuthorByAlias(alias);
            return response;
        } catch (err: any) {
            return err;
        }
    },
);

export const addAuthor = createAsyncThunk<AuthorItemJsModel, FormData, { rejectValue: AxiosError }>(
    'author/addAuthor',
    async (formData) => {
        try {
            const response = await AuthorClient.addAuthor(formData);
            return response;
        } catch (err: any) {
            return err;
        }
    },
);

interface EditAuthorProps {
    authorId: number;
    author: FormData;
}

export const editAuthor = createAsyncThunk<
    { author: AuthorItemJsModel; authorId: number },
    EditAuthorProps,
    { rejectValue: AxiosError }
>('author/editAuthor', async ({ authorId, author }, { fulfillWithValue }) => {
    try {
        const response = await AuthorClient.editAuthorById(authorId, author);
        fulfillWithValue({ author: response, authorId });
        return response;
    } catch (err: any) {
        return err;
    }
});

export const removeAuthor = createAsyncThunk<
    AuthorItemJsModel,
    number,
    { rejectValue: AxiosError }
>('author/removeAuthor', async (authorId) => {
    try {
        const response = await AuthorClient.removeAuthorById(authorId);
        return response;
    } catch (err: any) {
        return err;
    }
});

interface AddAuthorToFavoriteProps {
    authorId: number;
    isFavorite: boolean;
}

export const addAuthorToFavorite = createAsyncThunk<
    AddAuthorToFavoriteProps,
    AddAuthorToFavoriteProps,
    { rejectValue: AxiosError }
>('author/addAuthorToFavorite', async (authorId, isFavorite) => {
    try {
        const favorite = new FormData();
        favorite.append('item', `${authorId}`);
        favorite.append('favorite', `${isFavorite}`);
        const response = await AuthorClient.addAuthorToFavorite(favorite);

        if (response?.result === 'OK') {
            setTimeout(() => {
                return { authorId, isFavorite };
            }, 100);
        }
    } catch (err: any) {
        return err;
    }
});

interface LikeAuthorProps {
    authorId: number;
    hasLike: boolean;
}

export const likeAuthor = createAsyncThunk<
    LikeAuthorProps,
    LikeAuthorProps,
    { rejectValue: AxiosError }
>('author/likeAuthor', async (authorId, hasLike) => {
    try {
        const like = new FormData();
        like.append('item', `${authorId}`);
        like.append('like', `${hasLike}`);
        const response = await AuthorClient.addLikeToAuthor(like);

        if (response?.result === 'OK') {
            setTimeout(() => {
                return { authorId, hasLike };
            }, 100);
        }
    } catch (err: any) {
        return err;
    }
});

export const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAuthors.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getAuthors.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getAuthors.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getTopAuthors.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getTopAuthors.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getTopAuthors.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getFavoriteAuthors.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getFavoriteAuthors.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getFavoriteAuthors.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getRandomAuthors.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getRandomAuthors.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getRandomAuthors.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getAuthorsByGenreAlias.pending, (state) => {
                state.status = QueryStatus.request();
                state.list = { ...blankPagedResult };
            })
            .addCase(getAuthorsByGenreAlias.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list = action.payload;
            })
            .addCase(getAuthorsByGenreAlias.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(getAuthor.pending, (state) => {
                state.status = QueryStatus.request();
                state.current = { ...blankAuthorItem };
            })
            .addCase(getAuthor.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.current = action.payload.results[0];
            })
            .addCase(getAuthor.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
                state.current = { ...blankAuthorItem };
            })
            .addCase(addAuthor.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(addAuthor.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list.results = [...state.list.results, action.payload];
            })
            .addCase(addAuthor.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(editAuthor.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(editAuthor.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                const { author, authorId } = action.payload;
                const modifed = state.list.results.map((item) =>
                    item.id === authorId ? author : item,
                );
                state.list.results = modifed;
            })
            .addCase(editAuthor.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(removeAuthor.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(removeAuthor.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                state.list.results = state.list.results.filter(
                    (item) => item.id !== action.payload.id,
                );
            })
            .addCase(removeAuthor.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(addAuthorToFavorite.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(addAuthorToFavorite.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                const { authorId, isFavorite } = action.payload;

                if (state.current?.id === authorId) {
                    state.current.favorite = isFavorite;
                }
                state.list.results.forEach(({ id }, index) => {
                    if (id === authorId) {
                        state.list.results[index].favorite = isFavorite;
                    }
                });
            })
            .addCase(addAuthorToFavorite.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            })
            .addCase(likeAuthor.pending, (state) => {
                state.status = QueryStatus.request();
            })
            .addCase(likeAuthor.fulfilled, (state, action) => {
                state.status = QueryStatus.success();
                const { authorId, hasLike } = action.payload;

                if (state.current?.id === authorId) {
                    state.current.like = hasLike;
                    state.current.like_count = state.current.like_count + (hasLike ? 1 : -1);
                }
                state.list.results.forEach(({ id }, index) => {
                    if (id === authorId) {
                        state.list.results[index].like = hasLike;
                        state.list.results[index].like_count =
                            state.list.results[index].like_count + (hasLike ? 1 : -1);
                    }
                });
            })
            .addCase(likeAuthor.rejected, (state, action) => {
                const { statusText, reason, error } = errorData(action.payload);
                state.status = QueryStatus.error(statusText, reason, error);
            });
    },
});

export default authorSlice.reducer;
