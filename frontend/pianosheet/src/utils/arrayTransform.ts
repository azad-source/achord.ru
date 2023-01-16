export const arrToFlat = (ar: string[] | string): string[] => {
    let result: string[] = [];
    if (!Array.isArray(ar)) return [ar];
    ar.forEach((elm) => (result = result.concat(arrToFlat(elm))));
    return result;
};

export const arrToString = (ar: string[] | string): string => {
    let result: string = '';
    if (!Array.isArray(ar)) return ar;
    ar.forEach((elm) => (result += ' ' + arrToString(elm)));
    return result;
};
