import { SheetItemJsModel } from 'domain/api/JsModels';
import { useLazyGetAuthorByIdQuery } from 'redux/api/authorApi';
import { Paths } from 'utils/routes/Paths';

export const openDownloadPage = (sheet: SheetItemJsModel) => {
    const [getAuthorById] = useLazyGetAuthorByIdQuery();

    async function open() {
        try {
            const res = await getAuthorById({ id: sheet.author }).unwrap();
            const path = Paths.getSheetDownloadPath(
                res.name.charAt(0),
                res.alias,
                sheet.id.toString(),
            );
            window.open(path, '_blank');
        } catch {}
    }

    open();
};
