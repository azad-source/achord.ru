import * as React from 'react';
import styles from './SearchField.scss';
import cn from 'classnames';
import { Loupe } from 'components/shared/icons/Loupe';
import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/store';
import { dropSearch, searchSheets } from 'redux/slices/search';

interface Props {
    className?: string;
    isDark?: boolean;
}

export const SearchField: React.FC<Props> = ({ className, isDark = false }) => {
    const [input, setInput] = React.useState<string>('');
    let location = useLocation();

    const dispatch = useAppDispatch();
    const { status, query: searchQuery } = useAppSelector(({ search }: RootState) => search);

    function skipSearch() {
        dispatch(dropSearch());
        setInput('');
    }

    function searchHandler() {
        if (input && input.length > 2) {
            dispatch(searchSheets(input));
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
