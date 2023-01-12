import * as React from 'react';
import styles from './SheetsPage.scss';
import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { connect, useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { GenreJsModel } from 'domain/api/JsModels';
import { Link, useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';
import { QueryStatus } from 'domain/QueryStatus';
import { TextPlain } from 'components/shared/TextPlain/TextPlain';
import cn from 'classnames';

interface Props {
    genres: GenreJsModel;
    status: QueryStatus;
    getGenres: (page?: number) => void;
}

const SheetsPageFC: React.FC<Props> = ({ genres, status, getGenres }) => {
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const title = `${SiteName} - Ноты`;

    const isDark = useSelector((state: RootState) => state.app.theme === 'dark');

    React.useEffect(() => {
        document.title = title;
        getGenres();
    }, [location]);

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
        },
    ];

    const getGenresByPage = (page: number) => {
        getGenres(page);
        setPageNumber(page);
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    return (
        <Page breadcrumbs={breadcrumbs} showAddAuthorBtn status={status}>
            <div className={cn(styles.root, isDark && styles.root__dark)}>
                {genres.results.map(({ id, name, alias, preview }) => (
                    <Link key={id} className={styles.item} to={Paths.getGenrePage(alias)}>
                        <div
                            className={styles.preview}
                            style={{ backgroundImage: `url(${preview})` }}
                        />
                        <TextPlain
                            style={{
                                fontSize: 22 / Math.pow(name.length, 0.25),
                            }}
                            className={styles.name}
                        >
                            {name}
                        </TextPlain>
                    </Link>
                ))}
            </div>
            {genres.page_count > 1 && (
                <Pagination
                    pageCount={genres.page_count}
                    pageNumber={pageNumber}
                    switchPage={getGenresByPage}
                />
            )}
        </Page>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        status: state.sheets.status,
        genres: state.sheets.genres,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getGenres: sheetsAction.getGenres,
        },
        dispatch,
    );
};

export const SheetsPage = connect(mapStateToProps, mapDispatchToProps)(SheetsPageFC);
