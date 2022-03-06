import * as React from 'react';
import styles from './SheetDownloadPage.scss';
import { useParams } from 'react-router-dom';
import { Page } from 'components/shared/layout/Page/Page';
import { Button } from 'components/shared/Button/Button';
import { SheetsClient } from 'api/SheetsClient';
import { AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import { defaultAuthorItem, defaultSheetItem } from 'store/sheetsReducer';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
// import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
// import { Pagination } from 'components/shared/layout/Pagination/Pagination';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import test from './test.pdf';

interface Props {
    isSuperUser?: boolean;
}

const SheetDownloadPageFC: React.FC<Props> = ({ isSuperUser = false }) => {
    const { letter, authorAlias, sheetId } =
        useParams<{ letter: string; authorAlias: string; sheetId: string }>();

    const [sheet, setSheet] = React.useState<SheetItemJsModel>(defaultSheetItem);

    const [author, setAuthor] = React.useState<AuthorItemJsModel>(defaultAuthorItem);

    const [downloadState, setDownloadState] = React.useState<{ counter: number; started: boolean }>(
        {
            counter: 15,
            started: false,
        },
    );

    React.useEffect(() => {
        SheetsClient.getSheetById(sheetId).then((res) => {
            setSheet(res);
            document.title = `${SiteName} - ${res.name}`;
            SheetsClient.getAuthorById(res.author).then((author) => setAuthor(author));
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

    const [pagesCount, setPagesCount] = React.useState(0);
    const [pageNumber, setPageNumber] = React.useState(1);

    const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
        setPagesCount(pdf.numPages);
    };

    return (
        <Page breadcrumbs={breadcrumbs}>
            <div className={styles.root}>
                <div className={styles.fileName}>{sheet.name}</div>
                {sheet.filename ? (
                    <div className={styles.download}>
                        {downloadState.counter < 1 ? (
                            <div>
                                {/* {isSuperUser && (
                                    <>
                                        <p>
                                            Page {pageNumber} of {pagesCount}
                                        </p>
                                        <Document
                                            className={styles.pdfViewer}
                                            file={test}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                        >
                                            <PDFPage pageNumber={pageNumber} />
                                        </Document>
                                        <Pagination
                                            pageCount={pagesCount}
                                            pageNumber={pageNumber}
                                            switchPage={setPageNumber}
                                        />
                                    </>
                                )} */}

                                <Button
                                    onClick={download}
                                    className={styles.downloadButton}
                                    use="link"
                                >
                                    Ссылка на скачивание
                                </Button>
                            </div>
                        ) : downloadState.started ? (
                            <div className={styles.downloadInfo}>
                                Через {downloadState.counter} секунд появится ссылка на скачивание
                            </div>
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

const mapStateToProps = (state: RootState) => ({
    isSuperUser: state.users.currentUser.is_superuser,
});

export const SheetDownloadPage = connect(mapStateToProps)(SheetDownloadPageFC);
