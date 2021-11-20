export class Paths {
    /** Страница авторизации */
    public static readonly loginUrl = 'http://auth.pianosheet.ru';

    /** Главаня страница */
    public static readonly mainPage = '/';

    /** Раздел ноты */
    public static readonly sheetPage = '/sheets';

    /** Страница виртуального пианино */
    public static readonly virtPianoPage = '/virtual-piano';

    /** Страница авторизации/регистрации */
    public static readonly authPage = '/sign-in';

    /** Страница для выбранно буквы алфавита */
    public static readonly letterPage = `${Paths.sheetPage}/:letter`;

    public static getLetterPath = (letter: string) => `${Paths.sheetPage}/${letter}`;

    /** Страница детального просмотра автора */
    public static readonly authorPage = `${Paths.letterPage}/:authorAlias`;

    public static getAuthorPath = (letter: string, authorAlias: string) =>
        `${Paths.sheetPage}/${letter.toLowerCase()}/${authorAlias.toLowerCase()}`;

    /** Страница просмотра нот */
    public static readonly sheetDownloadPage = `${Paths.authorPage}/:sheetId`;

    public static getSheetDownloadPath = (letter: string, authorAlias: string, sheetId: string) =>
        `${Paths.sheetPage}/${letter.toLowerCase()}/${authorAlias.toLowerCase()}/${sheetId}`;

    /** Страница авторизации в VK */
    public static readonly authVKPage = '/login/check';

    /** Страница успешного подтверждении почты */
    public static readonly successConfirmEmailPage = '/activate/:uid/:token';

    /** Страница смены пароля */
    public static readonly changePasswordPage = '/password/reset/confirm/:uid/:token';

    /** Раздел жанра */
    public static readonly genrePage = '/genres';

    public static getGenrePage = (genreAlias: string) => `${Paths.genrePage}/${genreAlias}`;
}
