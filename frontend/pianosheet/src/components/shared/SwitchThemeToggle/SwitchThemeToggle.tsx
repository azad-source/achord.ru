import * as React from 'react';
import { Toggle } from '../Toggle/Toggle';
import styles from './SwitchThemeToggle.module.scss';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme, switchTheme } from 'redux/slices/appSlice';

interface Props {
    className?: string;
}

export const SwitchThemeToggle: React.FC<Props> = ({ className }) => {
    const dispatch = useAppDispatch();

    const isDark = useAppSelector(isDarkTheme);

    const themeToggler = () => {
        dispatch(switchTheme(isDark ? 'light' : 'dark'));
    };

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
