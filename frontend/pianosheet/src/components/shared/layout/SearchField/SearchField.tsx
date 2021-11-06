import * as React from 'react';
import styles from './SearchField.scss';
import cn from 'classnames';
import { Loupe } from 'components/shared/icons/Loupe';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { sheetsAction } from 'store/sheetsActions';
import { RootState } from 'store/rootReducer';
import { QueryStatus } from 'domain/QueryStatus';
import { useLocation } from 'react-router';
import { searchFieldWidth } from 'domain/SiteInfo';

const defaultSearchStyles = {
    width: searchFieldWidth,
    opacity: 0.7,
};

interface Props {
    className?: string;
    status: QueryStatus;
    searchQuery: string;
    searchSheets: (query: string) => void;
    dropSearch: () => void;
}

const SearchFieldFC: React.FC<Props> = ({
    className,
    status,
    searchQuery,
    searchSheets,
    dropSearch,
}) => {
    const [input, setInput] = React.useState<string>('');
    const [style, setStyle] = React.useState(defaultSearchStyles);
    let location = useLocation();

    function skipSearch() {
        dropSearch();
        setInput('');
    }

    function searchHandler() {
        if (input && input.length > 2) {
            searchSheets(input);
        }
    }

    function keyPressHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            searchHandler();
        }
    }

    React.useEffect(() => {
        if (status.isSuccess()) {
            skipSearch();
        }
    }, [location]);

    React.useEffect(() => {
        if (status.isSuccess()) {
            setInput('');
        }
    }, [searchQuery]);

    return (
        <div className={cn(styles.root, className)}>
            <label className={styles.label} style={style}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Поиск нот"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={keyPressHandler}
                    onClick={searchHandler}
                    onFocus={() => setStyle({ width: '100%', opacity: 1 })}
                    onBlur={() => setStyle(defaultSearchStyles)}
                    value={input}
                />
                <Loupe className={styles.loupe} />
            </label>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    status: state.sheets.search.status,
    searchQuery: state.sheets.search.query,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            searchSheets: sheetsAction.searchSheets,
            dropSearch: sheetsAction.dropSearch,
        },
        dispatch,
    );
};

export const SearchField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SearchFieldFC);
