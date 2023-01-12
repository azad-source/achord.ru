import * as React from 'react';
import { Toggle } from '../Toggle/Toggle';
import styles from './SwitchThemeToggle.module.scss';
import cn from 'classnames';

interface Props {
    isDark?: boolean;
    className?: string;
    themeToggler: () => void;
}

export const SwitchThemeToggle: React.FC<Props> = ({ isDark = false, className, themeToggler }) => {

    return (
        <Toggle
            onChange={themeToggler}
            position={isDark ? 'left' : 'right'}
            items={['light', 'dark']}
            className={cn(styles.toggle, className)}
            isDark={isDark}
        />
    );
};
