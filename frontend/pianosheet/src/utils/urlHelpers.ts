/**
 * Преобразует строку поиска в объект по переданному списку ключей.
 */
export function queryToObject<T>(
    query: string,
    objectKeys: (keyof T)[],
    defaultObj: Partial<T>,
): Record<string, string> {
    const obj: Record<string, any> = { ...defaultObj };
    const params = new URLSearchParams(query);

    objectKeys.forEach((key) => {
        const k = key as string;
        const param = params.get(k);
        if (param !== null) {
            obj[k] = param;
        }
    });

    return obj;
}

/**
 * Преобразует объект параметров в строку поиска.
 */
export function buildSearchString(params: Record<string, any>): string {
    const pairs: string[] = [];
    Object.keys(params).forEach((k) => {
        const key = encodeURIComponent(k);
        const value = params[key];

        if (value === undefined) {
            return;
        }

        if (Array.isArray(value)) {
            pairs.push(value.map((v) => `${key}=${encodeURIComponent(String(v))}`).join('&'));
        } else {
            pairs.push(`${key}=${encodeURIComponent(String(value))}`);
        }
    });
    return pairs.join('&');
}
