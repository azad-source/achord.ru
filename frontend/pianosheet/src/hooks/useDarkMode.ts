import React from 'react';
import { useDispatch } from 'react-redux';
import { appAction } from 'store/appActions';
import { ThemeType } from 'store/appReducer';

export const useDarkMode = () => {
    const [theme, setTheme] = React.useState<ThemeType>('light');
    const [mountedComponent, setMountedComponent] = React.useState(false);

    const dispatch = useDispatch();

    const setMode = (mode: ThemeType) => {
        window.localStorage.setItem('theme', mode);
        setTheme(mode);
        dispatch(appAction.switchTheme(mode));
    };

    const themeToggler = () => {
        theme === 'light' ? setMode('dark') : setMode('light');
    };

    React.useEffect(() => {
        const localTheme = (window.localStorage.getItem('theme') || 'light') as ThemeType;
        localTheme && setTheme(localTheme);
        setMountedComponent(true);
    }, []);

    return { theme, themeToggler, mountedComponent };
};
