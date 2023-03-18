import { AuthorItemJsModel, GenreItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';

export const DEFAULT_AUTHORS_SIZE = 20;
export const DEFAULT_SHEETS_SIZE = 20;

export const TOP_AUTHORS_SIZE = 12;
export const TOP_SHEETS_SIZE = 10;

export const RANDOM_AUTHORS_SIZE = TOP_AUTHORS_SIZE;
export const RANDOM_SHEETS_SIZE = TOP_SHEETS_SIZE;

export const FAVORITE_AUTHORS_SIZE = TOP_AUTHORS_SIZE;
export const FAVORITE_SHEETS_SIZE = TOP_SHEETS_SIZE;

export const AUTHORS_SEARCH_SIZE = DEFAULT_AUTHORS_SIZE;
export const SHEETS_SEARCH_SIZE = DEFAULT_SHEETS_SIZE;

export const abcEn = [
    // '0-9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

export const abcRu = [
    'а',
    'б',
    'в',
    'г',
    'д',
    'е',
    'ж',
    'з',
    'и',
    'к',
    'л',
    'м',
    'н',
    'о',
    'п',
    'р',
    'с',
    'т',
    'у',
    'ф',
    'х',
    'ц',
    'ч',
    'ш',
    'щ',
    'э',
    'ю',
    'я',
];

export const blankPagedResult = {
    count: 0,
    page_count: 0,
    page_size: 0,
    next: '',
    previous: '',
    results: [],
};

export const blankSearch = {
    applied: false,
    sheets: { ...blankPagedResult },
    authors: { ...blankPagedResult },
    query: '',
};

export const blankAuthorItem: AuthorItemJsModel = {
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

export const blankSheetItem: SheetItemJsModel = {
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

export const blankGenreItem: GenreItemJsModel = {
    id: 0,
    name: '',
    alias: '',
};
