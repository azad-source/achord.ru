import * as React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { abcEn, abcRu } from 'utils/constants';
import { Paths } from 'utils/routes/Paths';
import cn from 'classnames';
import styles from './SheetsNav.module.scss';

interface Props {
    isMenu?: boolean;
    hideEn?: boolean;
    hideRu?: boolean;
    isDark?: boolean;
}

export const SheetsNav: React.FC<Props> = ({
    isMenu = false,
    hideEn = false,
    hideRu = false,
    isDark = false,
}) => (
    <div className={cn(styles.root, isMenu && styles.root_isMenu)}>
        {!hideEn && <Letters items={abcEn} isMenu={isMenu} isDark={isDark} />}
        {!hideRu && <Letters items={abcRu} isMenu={isMenu} isDark={isDark} />}
    </div>
);

const Letters: React.FC<{ items: string[]; isMenu: boolean; isDark?: boolean }> = ({
    items,
    isMenu,
    isDark = false,
}) => {
    const { letter } = useParams<{ letter: string }>();
    const isActive = (l: string) => letter === l;
    return (
        <div className={cn(styles.wrapper, isDark && styles.wrapper__dark)}>
            {items.map((l) => (
                <NavLink
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
                </NavLink>
            ))}
        </div>
    );
};
