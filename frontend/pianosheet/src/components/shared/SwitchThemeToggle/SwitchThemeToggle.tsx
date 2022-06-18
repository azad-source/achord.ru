import { useDarkMode } from 'hooks/useDarkMode';
import * as React from 'react';
import { Toggle } from '../Toggle/Toggle';
import styles from './SwitchThemeToggle.module.scss';
import cn from 'classnames';

interface Props {
    className?: string;
}

export const SwitchThemeToggle: React.FC<Props> = ({ className }) => {
    const { theme, themeToggler, mountedComponent } = useDarkMode();

    return (
        <Toggle
            onChange={themeToggler}
            position={theme === 'light' ? 'right' : 'left'}
            items={['light', 'dark']}
            className={cn(styles.toggle, className)}
        />
    );
};
