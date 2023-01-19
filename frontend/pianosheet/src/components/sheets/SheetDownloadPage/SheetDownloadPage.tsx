import * as React from 'react';
import styles from './SheetDownloadPage.module.scss';
import { useParams } from 'react-router-dom';
import { Page } from 'components/shared/layout/Page/Page';
import { Button } from 'components/shared/Button/Button';
import { AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import cn from 'classnames';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useAppSelector } from 'redux/hooks';
import { SheetClient } from 'redux/api/SheetClient';
import { AuthorClient } from 'redux/api/AuthorClient';
import { isDarkTheme } from 'redux/slices/app';
import { blankAuthorItem, blankSheetItem } from 'utils/constants';
// import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
// import { PDFDocumentProxy } from 'pdfjs-dist';
// import { Pagination } from 'components/shared/layout/Pagination/Pagination';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import test from './test.pdf';

export const SheetDownloadPage = () => {
    const isSuperUser = useAppSelector((state) => state.user.currentUser.is_superuser);

    const {
        letter = '',
        authorAlias = '',
        sheetId,
    } = useParams<{
        letter: string;
        authorAlias: string;
        sheetId: string;
    }>();

    const [sheet, setSheet] = React.useState<SheetItemJsModel>(blankSheetItem);

    const [author, setAuthor] = React.useState<AuthorItemJsModel>(blankAuthorItem);

    const [downloadState, setDownloadState] = React.useState<{ counter: number; started: boolean }>(
        {
            counter: 15,
            started: false,
        },
    );

    const isDark = useAppSelector(isDarkTheme);

    React.useEffect(() => {
        SheetClient.getSheetById(sheetId).then((res) => {
            setSheet(res);
            document.title = `${SiteName} - ${res.name}`;
            AuthorClient.getAuthorById(res.author).then((author) => setAuthor(author));
        });
    }, []);

    const download = () => {
        const file = sheet.filename;
        let link = document.createElement('a');
        link.setAttribute('href', file);
        link.setAttribute('download', file);
        link.click();
    };

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetsPage,
        },
        {
            caption: letter.toUpperCase(),
            link: Paths.getLetterPath(letter),
        },
        {
            caption: author.name,
            link: Paths.getAuthorPath(letter, authorAlias),
        },
    ];

    const startCounter = () => {
        setDownloadState((prev) => ({ ...prev, started: true }));
        const timeout = setInterval(() => {
            setDownloadState((prev) => ({ started: true, counter: prev.counter - 1 }));
            if (downloadState.counter < 0) clearInterval(timeout);
        }, 1000);
    };

    // const [pagesCount, setPagesCount] = React.useState(0);
    // const [pageNumber, setPageNumber] = React.useState(1);

    // const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
    //     setPagesCount(pdf.numPages);
    // };

    return (
        <Page breadcrumbs={breadcrumbs}>
            <div className={cn(styles.root, isDark && styles.root__dark)}>
                <TextPlain className={styles.fileName}>{sheet.name}</TextPlain>
                {sheet.filename ? (
                    <div className={styles.download}>
                        {downloadState.counter < 1 ? (
                            <Button onClick={download} className={styles.downloadButton} use="link">
                                Ссылка на скачивание
                            </Button>
                        ) : downloadState.started ? (
                            <TextPlain className={styles.downloadInfo}>
                                Через {downloadState.counter} секунд появится ссылка на скачивание
                            </TextPlain>
                        ) : (
                            <Button onClick={startCounter} className={styles.downloadButton}>
                                Скачать
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className={styles.notFound}>...</div>
                )}
            </div>
        </Page>
    );
};

// const mapStateToProps = (state: RootState) => ({
//     isSuperUser: state.users.currentUser.is_superuser,
// });

// export const SheetDownloadPage = connect(mapStateToProps)(SheetDownloadPageFC);
