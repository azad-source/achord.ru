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

interface Props {
    className?: string;
    status: QueryStatus;
    searchQuery: string;
    isDark?: boolean;
    searchSheets: (query: string) => void;
    dropSearch: () => void;
}

const SearchFieldFC: React.FC<Props> = ({
    className,
    status,
    searchQuery,
    isDark = false,
    searchSheets,
    dropSearch,
}) => {
    const [input, setInput] = React.useState<string>('');
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
        <div className={cn(styles.root, isDark && styles.root__dark, className)}>
            <label className={styles.label}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Поиск нот"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={keyPressHandler}
                    onClick={searchHandler}
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

export const SearchField = connect(mapStateToProps, mapDispatchToProps)(SearchFieldFC);
