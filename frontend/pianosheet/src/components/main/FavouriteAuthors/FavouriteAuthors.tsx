import { SheetsClient } from 'api/SheetsClient';
import { AuthorJsModel, SheetItemJsModel, SheetJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'store/rootReducer';
import styles from './FavouriteAuthors.scss';
import { Paths } from 'utils/routes/Paths';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import { sheetsAction } from 'store/sheetsActions';

interface Props {}

const FavouriteAuthorsFC: React.FC<Props> = ({}) => {
    return <>Избранное</>;
};

const mapStateToProps = ({ sheets: { authors, sheets } }: RootState) => ({
    authors,
    sheets,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({}, dispatch);
};

export const FavouriteAuthors = connect(mapStateToProps, mapDispatchToProps)(FavouriteAuthorsFC);
