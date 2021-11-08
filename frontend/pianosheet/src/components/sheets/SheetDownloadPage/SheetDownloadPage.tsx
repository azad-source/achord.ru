import * as React from 'react';
import styles from './SheetDownloadPage.scss';
import cn from 'classnames';
import { useParams } from 'react-router-dom';
import { Page } from 'components/shared/layout/Page/Page';
import { Button } from 'components/shared/Button/Button';
import { SheetsClient } from 'api/SheetsClient';
import { AuthorItemJsModel, SheetItemJsModel } from 'domain/api/JsModels';
import { defaultAuthorItem, defaultSheetItem } from 'store/sheetsReducer';
import { SiteName } from 'domain/SiteInfo';
import { Breadcrumbs } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { Paths } from 'utils/routes/Paths';

interface Props {
    className?: string;
}

export const SheetDownloadPage: React.FC<Props> = ({ className }) => {
    const { letter, authorAlias, sheetId } =
        useParams<{ letter: string; authorAlias: string; sheetId: string }>();

    const [sheet, setSheet] = React.useState<SheetItemJsModel>(defaultSheetItem);

    const [author, setAuthor] = React.useState<AuthorItemJsModel>(defaultAuthorItem);

    const [disabled, setDisabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        SheetsClient.getSheetById(sheetId).then((res) => {
            setSheet(res);
            document.title = `${SiteName} - ${res.name}`;
            SheetsClient.getAuthorById(res.author).then((author) => setAuthor(author));
        });
    }, []);

    const download = () => {
        setDisabled(true);
        const timeout = setTimeout(() => {
            const file = sheet.filename;
            let link = document.createElement('a');
            link.setAttribute('href', file);
            link.setAttribute('download', file);
            link.click();
            setDisabled(false);
            clearInterval(timeout);
        }, 1000);
    };

    const breadcrumbs: { caption: string; link?: string }[] = [
        {
            caption: 'Ноты',
            link: Paths.sheetPage,
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

    return (
        <Page>
            <Breadcrumbs items={breadcrumbs} />
            <div className={cn(styles.oot, className)}>
                <div className={styles.fileName}>{sheet.name}</div>
                {sheet.filename ? (
                    <div className={styles.download}>
                        <Button
                            disabled={disabled}
                            onClick={download}
                            className={styles.downloadButton}
                        >
                            Download
                        </Button>
                    </div>
                ) : (
                    <div className={styles.notFound}>...</div>
                )}
            </div>
        </Page>
    );
};
