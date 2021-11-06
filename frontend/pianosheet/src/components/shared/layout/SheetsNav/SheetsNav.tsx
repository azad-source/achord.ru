import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { abcEn, abcRu } from 'utils/constants';
import { Paths } from 'utils/routes/Paths';
import cn from 'classnames';
import styles from './SheetsNav.scss';

export const SheetsNav = () => {
    const { letter } = useParams<{ letter: string }>();
    return (
        <div className={styles.root}>
            <div className={styles.abcWrap}>
                {abcEn.map((l, i) => {
                    return (
                        <div key={i} className={cn(styles.letterItem, letter===l && styles.activeLetterItem)}>
                            <Link
                                className={styles.letterItemLink}
                                to={Paths.getLetterPath(l)}
                                translate="no"
                            >
                                {l}
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div className={styles.abcWrap}>
                {abcRu.map((l, i) => {
                    return (
                        <div key={i} className={cn(styles.letterItem, letter===l && styles.activeLetterItem)}>
                            <Link
                                className={styles.letterItemLink}
                                to={Paths.getLetterPath(l)}
                            >
                                {l}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
