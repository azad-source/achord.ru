import * as React from 'react';
import styles from './SheetsPage.scss';
import { Page } from 'components/shared/layout/Page/Page';
import { SiteName } from 'domain/SiteInfo';
import { BreadcrumbProps } from 'components/shared/layout/Breadcrumbs/Breadcrumbs';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { GenreJsModel } from 'domain/api/JsModels';
import { Link, useLocation } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';

interface Props {
    genres: GenreJsModel;
    getGenres: (page?: number) => void;
}

const SheetsPageFC: React.FC<Props> = ({ genres, getGenres }) => {
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const location = useLocation();
    const title = `${SiteName} - Ноты`;

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
        <Page breadcrumbs={breadcrumbs} showAddAuthorBtn meta={{ title }}>
            <div className={styles.genres}>
                {genres.results.map(({ id, name, alias, preview }) => (
                    <Link
                        key={id}
                        className={styles.genres__item}
                        to={Paths.getGenrePage(alias)}
                        style={{
                            fontSize: 22 / Math.pow(name.length, 0.25),
                        }}
                    >
                        <div
                            className={styles.preview}
                            style={{ backgroundImage: `url(${preview})` }}
                        />
                        <div className={styles.name}>{name}</div>
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
