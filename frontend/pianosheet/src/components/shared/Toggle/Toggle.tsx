import * as React from 'react';
import styles from './Toggle.module.scss';
import cn from 'classnames';

interface Props {
    position: 'left' | 'right';
    items: string[];
    onChange: () => void;
}

export const Toggle: React.FC<Props> = ({ position, items, onChange }) => {
    return (
        <div className={cn(styles.root)} onClick={onChange}>
            <div className={styles[`root_${position}`]}></div>
            <div className={styles.root__right}>{items[0]}</div>
            <div className={styles.root__checkbox}></div>
            <div className={styles.root__left}>{items[1]}</div>
        </div>
    );
};
