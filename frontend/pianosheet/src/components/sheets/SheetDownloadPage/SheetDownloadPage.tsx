import * as React from 'react';
import styles from './SheetDownloadPage.module.scss';
import { useParams } from 'react-router-dom';
import { Page } from 'components/shared/layout/Page/Page';
import { Button } from 'components/shared/Button/Button';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';
import cn from 'classnames';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';
import { useLazyGetAuthorByIdQuery, useLazyGetSheetByIdQuery } from 'redux/api';

export const SheetDownloadPage = () => {
    const [getAuthorById, { data: author }] = useLazyGetAuthorByIdQuery();
    const [getSheetById, { data: sheet }] = useLazyGetSheetByIdQuery();
    const {
        letter = '',
        authorAlias = '',
        sheetId,
    } = useParams<{
        letter: string;
        authorAlias: string;
        sheetId: string;
    }>();

    const [downloadState, setDownloadState] = React.useState<{ counter: number; started: boolean }>(
        {
            counter: 15,
            started: false,
        },
    );

    const isDark = useAppSelector(isDarkTheme);

    async function getAuthor() {
        try {
            const sheet = await getSheetById({ noteId: sheetId }).unwrap();
            document.title = `${SiteName} - ${sheet.name}`;
            await getAuthorById({ id: sheet.author });
        } catch {}
    }

    React.useEffect(() => {
        getAuthor();
    }, []);

    const download = () => {
        const file = sheet?.filename;
        if (file) {
            let link = document.createElement('a');
            link.setAttribute('href', file);
            link.setAttribute('download', file);
            link.setAttribute('target', '_blank');
            link.click();
        }
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
            caption: author?.name || '',
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

    return (
        <Page breadcrumbs={breadcrumbs}>
            <div className={cn(styles.root, isDark && styles.root__dark)}>
                <TextPlain className={styles.fileName}>
                    {sheet?.name || 'Название отсутствует'}
                </TextPlain>
                {sheet?.filename ? (
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
