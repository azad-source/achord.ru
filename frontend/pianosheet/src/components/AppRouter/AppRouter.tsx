import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { Spinner } from 'components/shared/Spinner/Spinner';
import { Header } from 'components/shared/layout/Header/Header';
import { Footer } from 'components/shared/layout/Footer/Footer';
import styles from './AppRouter.scss';
import { SheetsPage } from 'components/sheets/SheetsPage/SheetsPage';
import { MainPage } from 'components/main/MainPage';
import { AuthPage } from 'components/auth/AuthPage';
import { LetterPage } from 'components/sheets/LetterPage/LetterPage';
import { AuthorPage } from 'components/sheets/AuthorPage/AuthorPage';
import { SheetDownloadPage } from 'components/sheets/SheetDownloadPage/SheetDownloadPage';
import { NotFoundPage } from 'components/shared/layout/NotFoundPage/NotFoundPage';
import { AuthPageVk } from 'components/auth/AuthPageVk';
import { SuccessRegistrationPage } from 'components/auth/SuccessRegistrationPage';
import { ChangePasswordPage } from 'components/auth/ChangePasswordPage';
import { PlayOnlinePage } from 'components/virtualPiano/PlayOnlinePage';
import { GenrePage } from 'components/sheets/GenrePage/GenrePage';
import { ContactsPage } from 'components/contacts/ContactsPage';
import { PrivacyPage } from 'components/privacy/PrivacyPage';

const AppRouter = () => (
    <div className={styles.root}>
        <React.Suspense fallback={<Spinner />}>
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route path={Paths.sheetsPage} component={SheetsPage} exact />
                    <Route path={Paths.genrePage} component={GenrePage} exact />
                    <Route path={Paths.letterPage} component={LetterPage} exact />
                    <Route path={Paths.authorPage} component={AuthorPage} exact />
                    <Route path={Paths.sheetDownloadPage} component={SheetDownloadPage} exact />
                    <Route path={Paths.authPage} component={AuthPage} exact />
                    <Route path={Paths.authVKPage} component={AuthPageVk} exact />
                    <Route
                        path={Paths.successConfirmEmailPage}
                        component={SuccessRegistrationPage}
                        exact
                    />
                    <Route path={Paths.changePasswordPage} component={ChangePasswordPage} exact />
                    <Route path={Paths.virtPianoPage} component={PlayOnlinePage} exact />
                    <Route path={Paths.contactsPage} component={ContactsPage} exact />
                    <Route path={Paths.privacyPage} component={PrivacyPage} exact />
                    <Route path={Paths.mainPage} component={MainPage} exact />
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </BrowserRouter>
        </React.Suspense>
    </div>
);

export default AppRouter;
