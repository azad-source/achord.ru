import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { abcEn, abcRu } from 'utils/constants';
import { Paths } from 'utils/routes/Paths';
import cn from 'classnames';
import styles from './SheetsNav.scss';

interface Props {
    isMenu?: boolean;
    hideEn?: boolean;
    hideRu?: boolean;
}

export const SheetsNav: React.FC<Props> = ({ isMenu = false, hideEn = false, hideRu = false }) => (
    <div className={cn(styles.root, isMenu && styles.root_isMenu)}>
        {!hideEn && <Letters items={abcEn} isMenu={isMenu} />}
        {!hideRu && <Letters items={abcRu} isMenu={isMenu} />}
    </div>
);

const Letters: React.FC<{ items: string[]; isMenu: boolean }> = ({ items, isMenu }) => {
    const { letter } = useParams<{ letter: string }>();
    const isActive = (l: string) => letter === l;
    return (
        <div className={styles.wrapper}>
            {items.map((l) => (
                <Link
                    key={l}
                    className={cn(
                        styles.letter,
                        isActive(l) && styles.letter_active,
                        isMenu && styles.letter_inversion,
                    )}
                    to={Paths.getLetterPath(l)}
                    translate="no"
                >
                    {l}
                </Link>
            ))}
        </div>
    );
};
