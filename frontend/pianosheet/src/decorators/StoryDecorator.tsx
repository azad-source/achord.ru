import { ReactRenderer } from '@storybook/react';
import { SwitchThemeToggle } from 'components/shared/SwitchThemeToggle/SwitchThemeToggle';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PartialStoryFn } from '@storybook/types';
import { store } from 'redux/store';
import styles from './StoryDecorator.module.scss';
import { useAppSelector } from 'redux/hooks';
import { isDarkTheme } from 'redux/slices/appSlice';

type StoryType = PartialStoryFn<ReactRenderer, { [x: string]: any }>;

export const StoryDecorator = (Story: StoryType) => (
    <Provider store={store}>
        <StoryWrapper Story={Story} />
    </Provider>
);

const StoryWrapper: React.FC<{ Story: StoryType }> = ({ Story }) => {
    const isDark = useAppSelector(isDarkTheme);
    const bgColor = isDark ? 'rgb(60, 64, 67)' : '#fff';

    return (
        <div className={styles.root}>
            <div className={styles.topPanel} style={{ backgroundColor: bgColor }}>
                <SwitchThemeToggle />
            </div>
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        </div>
    );
};
