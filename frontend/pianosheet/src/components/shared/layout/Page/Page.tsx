import * as React from 'react';
import cn from 'classnames';
import styles from './Page.scss';
import { QueryStatus } from 'domain/QueryStatus';
import { Spinner } from 'components/shared/Spinner/Spinner';
import { RootState } from 'store/rootReducer';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { sheetsAction } from 'store/sheetsActions';
import { SheetsNav } from '../SheetsNav/SheetsNav';
import { SearchApiResults } from 'store/sheetsReducer';
import { SearchResults } from 'components/search/SearchResults';
import { useToast } from 'components/shared/Toast/Toast';

interface Props {
    className?: string;
    loadStatus?: QueryStatus;
    children: React.ReactNode;
    search: SearchApiResults;
    hideSheetsNav?: boolean;
    warning?: string;
    dropSearch: () => void;
    searchSheets: (query: string, page: number) => void;
    searchAuthors: (query: string, page: number) => void;
}

const PageFC: React.FC<Props> = ({
    className,
    children,
    loadStatus = QueryStatus.success(),
    search,
    hideSheetsNav = false,
    warning,
    dropSearch,
    searchSheets,
    searchAuthors,
}) => {
    const [showContent, setShowContent] = React.useState<boolean>(false);

    React.useEffect(() => {
        setTimeout(() => {
            setShowContent(true);
        }, 500);
    }, []);

    let output: React.ReactNode = '';

    if (search.applied) {
        output = (
            <SearchResults
                search={search}
                skipSearch={dropSearch}
                searchSheets={searchSheets}
                searchAuthors={searchAuthors}
            />
        );
    } else {
        output = loadStatus.isRequest() ? <Spinner /> : children;
    }

    const { toast, push } = useToast();

    React.useEffect(() => {
        if (warning) push(warning);
    }, [warning]);

    return (
        <>
            {!hideSheetsNav && <SheetsNav />}
            <div className={cn(styles.root, className)}>{showContent ? output : <Spinner />}</div>
            {toast}
        </>
    );
};

type OwnProps = Pick<Props, 'className' | 'loadStatus' | 'children'>;

const mapStateToProps = (state: RootState, { className, loadStatus, children }: OwnProps) => ({
    className,
    loadStatus,
    children,
    search: state.sheets.search,
    warning: state.sheets.warning,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            dropSearch: sheetsAction.dropSearch,
            searchSheets: sheetsAction.searchSheetsByPage,
            searchAuthors: sheetsAction.searchAuthorsByPage,
        },
        dispatch,
    );
};

export const Page = connect(mapStateToProps, mapDispatchToProps)(PageFC);
