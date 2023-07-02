import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story) => (
            <Provider store={store}>
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            </Provider>
        ),
    ],
};

export default preview;
