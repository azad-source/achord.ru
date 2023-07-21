import { ReactRenderer } from '@storybook/react';
import { SwitchThemeToggle } from 'components/shared/SwitchThemeToggle/SwitchThemeToggle';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PartialStoryFn } from '@storybook/types';
import { store } from 'redux/store';
import styles from './StoryDecorator.module.scss';

type StoryType = PartialStoryFn<ReactRenderer, { [x: string]: any }>;

export const StoryDecorator = (Story: StoryType) => {
    return (
        <Provider store={store}>
            <div className={styles.root}>
                <div className={styles.topPanel}>
                    <SwitchThemeToggle />
                </div>
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            </div>
        </Provider>
    );
};
