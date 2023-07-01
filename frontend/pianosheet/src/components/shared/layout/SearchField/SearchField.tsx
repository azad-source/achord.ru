import * as React from 'react';
import styles from './SearchField.module.scss';
import cn from 'classnames';
import { Loupe } from 'components/shared/icons/Loupe';
import { useLocation } from 'react-router';

interface Props {
    className?: string;
    isDark?: boolean;
    query: string;
    isSuccess: boolean;
    searchSheets: (query: string) => void;
    dropSearch: () => void;
}

export const SearchField: React.FC<Props> = ({
    className,
    isDark = false,
    query,
    isSuccess,
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
