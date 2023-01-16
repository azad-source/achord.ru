import * as React from 'react';
import AppRouter from './AppRouter/AppRouter';
import Layout from './shared/layout/Layout';

export const App = () => (
    <Layout>
        <AppRouter />
    </Layout>
);
