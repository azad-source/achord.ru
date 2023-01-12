import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import 'styles/app.scss';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { rootReducer } from 'store/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

/** Декоратор для доступа к стору */
const history = createBrowserHistory();
const store = createStore(
    rootReducer(history),
    composeWithDevTools(applyMiddleware(thunk)),
);

addDecorator((story) => <Provider store={store}>{story()}</Provider>);
/** Декоратор для доступа к стору END */

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
));
