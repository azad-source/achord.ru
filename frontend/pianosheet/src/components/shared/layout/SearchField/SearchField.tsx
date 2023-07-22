import * as React from 'react';
import styles from './SearchField.module.scss';
import cn from 'classnames';
import { Loupe } from 'components/shared/icons/Loupe';
import { useLocation } from 'react-router';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

interface Props {
    className?: string;
    query: string;
    isSuccess: boolean;
    onSearch: (query: string) => void;
    onDropSearch: () => void;
}

export const SearchField: React.FC<Props> = ({
    className,
    query,
    isSuccess,
    onSearch,
    onDropSearch,
}) => {
    const isDark = useAppSelector(isDarkTheme);

    const [input, setInput] = React.useState<string>('');
    let location = useLocation();

    function skipSearch() {
        onDropSearch();
        setInput('');
    }

    function searchHandler() {
        if (input && input.length > 2) {
            onSearch(input);
        }
    }

    function keyPressHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            searchHandler();
        }
    }

    React.useEffect(() => {
        if (isSuccess) {
            skipSearch();
        }
    }, [location]);

    React.useEffect(() => {
        if (isSuccess) {
            setInput('');
        }
    }, [query]);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark, className)}>
            <label className={styles.label}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Поиск нот"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyUp={keyPressHandler}
                    onClick={searchHandler}
                    value={input}
                />
                <Loupe className={styles.loupe} />
            </label>
        </div>
    );
};
