import { AuthorJsModel, AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import authorImage from './img200x200.jpg';

const sheetDefault: SheetItemJsModel = {
    id: 1,
    name: 'name',
    filename: 'filename',
    author: 1,
    savedate: '01.01.2021',
    rate: 0,
};

const sheetsNames = [
    'аканье',
    'алфаки',
    'анабат',
    'ардасс',
    'арысец',
    'ахание',
    'банчок',
    'белила',
    'бельмо',
    'беляна',
    'берула',
    'борнен',
    'боскет',
    'бундес',
    'версор',
    'винчит',
    'вмятие',
];

const authorsNames = [
    'нацмен',
    'немчик',
    'огонёк',
    'округа',
    'опёнок',
    'отбель',
    'парвус',
    'патака',
    'пелидн',
    'портер',
    'промыв',
    'пьяная',
    'самбал',
    'сигнум',
    'скалка',
    'сменка',
    'смолье',
    'спектр',
    'стычка',
    'татьба',
    'тетеха',
    'тетёра',
    'тиазан',
    'титинг',
    'увязка',
    'уловка',
    'фангит',
    'фукоза',
    'хиллит',
    'холмич',
    'цоизит',
    'чаинка',
    'чанщик',
    'шелюга',
    'шмакке',
    'шплинт',
    'эллипс',
    'элюция',
    'эпицит',
    'этенон',
    'яранка',
];

export const SheetsMock: SheetItemJsModel[] = sheetsNames.map((name, index) => ({
    ...sheetDefault,
    name,
    id: index,
    author: sheetsNames.length - index,
}));

const AuthorList: AuthorItemJsModel[] = authorsNames.map((name, index) => ({
    name,
    id: index,
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget risus eros. Nam nec gravida dui, eu volutpat justo. Integer sagittis tortor ac laoreet finibus. Aenean vehicula tortor et mauris gravida luctus. Nullam id massa vel quam pellentesque laoreet. Mauris sit amet quam porttitor, tempor nulla a, convallis justo. Curabitur nec consectetur arcu. Maecenas metus magna, lacinia et tempus eget, tempus vel ligula. In hac habitasse platea dictumst. Vestibulum nec suscipit ante. Sed porttitor ex tellus, ac ultrices augue posuere faucibus. Donec elementum arcu eget ipsum luctus, ut accumsan arcu feugiat. Curabitur non tristique mauris, id vehicula erat.',
    preview: authorImage,
    preview_s: authorImage,
    alias: 'author_alias',
    rate: 0,
    genres: [],
    owner: 1,
}));

export const AuthorsMock: AuthorJsModel = {
    count: 0,
    page_count: 0,
    page_size: 20,
    next: '',
    previous: '',
    results: AuthorList,
};
