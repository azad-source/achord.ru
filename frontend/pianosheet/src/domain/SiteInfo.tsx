import logo from 'images/logo.png';

export const SiteName: string = 'A-Chord';

/** Максимальный размер загружаемого файла pdf в байтах */
export const maxUploadPdfSize: number = 20000000;

/** Максимальный размер загружаемой картинки в байтах */
export const maxUploadImageSize: number = 20000000;

/** Ширина поисковой строки по дефолту */
export const searchFieldWidth: string = '50px';

/** Максимальная длина текста описания автора */
export const maxAuthorDescriptionLength: number = 3000;

/** SEO */
export const defaultSEO = {
    title: 'Ноты современных и классических произведений для фортепиано',
    description:
        'На сайте представлены ноты современных и классических, отечественных и зарубежных композиторов',
    keywords:
        'ноты, ноты для фортепиано, современные произведения, классика, зарубежные произведения, отечественные произвеения',
    url: 'https://achord.ru/',
    image: logo,
};
