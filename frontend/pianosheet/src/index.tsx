import * as React from 'react';
import ReactDOM from 'react-dom';
import './styles/app.scss';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { App } from './components/App';
import { applyMiddleware, createStore } from 'redux';
import { rootReducer } from './store/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import reportWebVitals from './reportWebVitals';
import thunk from 'redux-thunk';

const root = document.getElementById('root');
const history = createBrowserHistory();
const store = createStore(
    rootReducer(history),
    composeWithDevTools(applyMiddleware(thunk)),
);

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, root);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
