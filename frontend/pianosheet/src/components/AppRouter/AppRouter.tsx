import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Paths } from '../../utils/routes/Paths';
import { Spinner } from '../shared/Spinner/Spinner';
import { Header } from 'components/shared/layout/Header/Header';
import { Footer } from 'components/shared/layout/Footer/Footer';
import styles from './AppRouter.scss';
import SheetsPage from '../sheets/SheetsPage';
import MainPage from '../main/MainPage';
import { AuthPage } from '../auth/AuthPage';
import { LetterPage } from 'components/sheets/LetterPage/LetterPage';
import { AuthorPage } from 'components/sheets/AuthorPage/AuthorPage';
import { SheetDownloadPage } from 'components/sheets/SheetDownloadPage/SheetDownloadPage';
import { NotFoundPage } from 'components/shared/layout/NotFoundPage/NotFoundPage';
import { AuthPageVk } from 'components/auth/AuthPageVk';
import { SuccessRegistrationPage } from 'components/auth/SuccessRegistrationPage';
import { ChangePasswordPage } from 'components/auth/ChangePasswordPage';
import { PlayOnlinePage } from 'components/virtualPiano/PlayOnlinePage';

const AppRouter = () => (
    <div className={styles.root}>
        <React.Suspense fallback={<Spinner />}>
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route
                        path={Paths.sheetPage}
                        component={SheetsPage}
                        exact
                    />
                    <Route
                        path={Paths.letterPage}
                        component={LetterPage}
                        exact
                    />
                    <Route
                        path={Paths.authorPage}
                        component={AuthorPage}
                        exact
                    />
                    <Route
                        path={Paths.sheetDownloadPage}
                        component={SheetDownloadPage}
                        exact
                    />
                    <Route path={Paths.authPage} component={AuthPage} exact />
                    <Route
                        path={Paths.authVKPage}
                        component={AuthPageVk}
                        exact
                    />
                    <Route
                        path={Paths.successConfirmEmailPage}
                        component={SuccessRegistrationPage}
                        exact
                    />
                    <Route
                        path={Paths.changePasswordPage}
                        component={ChangePasswordPage}
                        exact
                    />
                    <Route
                        path={Paths.virtPianoPage}
                        component={PlayOnlinePage}
                        exact
                    />
                    <Route path={Paths.mainPage} component={MainPage} exact />
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </BrowserRouter>
        </React.Suspense>
    </div>
);

export default AppRouter;
