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
import { Link } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';

interface Props {
    genres: GenreJsModel;
    getGenres: () => void;
}

const SheetsPageFC: React.FC<Props> = ({ genres, getGenres }) => {
    React.useEffect(() => {
        document.title = `${SiteName} - Ноты`;
        getGenres();
    }, []);

    const breadcrumbs: BreadcrumbProps[] = [
        {
            caption: 'Ноты',
        },
    ];

    return (
        <Page breadcrumbs={breadcrumbs}>
            <div className={styles.genres}>
                {genres.results.map(({ id, name, alias }) => (
                    <Link key={id} className={styles.genres__item} to={Paths.getGenrePage(alias)}>
                        {name}
                    </Link>
                ))}
            </div>
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
