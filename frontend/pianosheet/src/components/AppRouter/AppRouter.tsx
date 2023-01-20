import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import { Spinner } from 'components/shared/Spinner/Spinner';
import { Header } from 'components/shared/layout/Header/Header';
import { Footer } from 'components/shared/layout/Footer/Footer';
import styles from './AppRouter.module.scss';
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
import { CopyrightHolders } from 'components/rights/CopyrightHolders';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isDarkTheme, switchTheme } from 'redux/slices/app';

const AppRouter = () => {
    React.useEffect(() => {
        dispatch(switchTheme());
    }, []);
    
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(isDarkTheme);

    return (
        <div className={cn(styles.root, isDark && styles.root__dark)}>
            <React.Suspense fallback={<Spinner />}>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path={Paths.sheetsPage} element={<SheetsPage />} />
                        <Route path={Paths.genrePage} element={<GenrePage />} />
                        <Route path={Paths.letterPage} element={<LetterPage />} />
                        <Route path={Paths.authorPage} element={<AuthorPage />} />
                        <Route path={Paths.sheetDownloadPage} element={<SheetDownloadPage />} />
                        <Route path={Paths.authPage} element={<AuthPage />} />
                        <Route path={Paths.authVKPage} element={<AuthPageVk />} />
                        <Route
                            path={Paths.successConfirmEmailPage}
                            element={<SuccessRegistrationPage />}
                        />
                        <Route path={Paths.changePasswordPage} element={<ChangePasswordPage />} />
                        <Route path={Paths.virtPianoPage} element={<PlayOnlinePage />} />
                        <Route path={Paths.contactsPage} element={<ContactsPage />} />
                        <Route path={Paths.privacyPage} element={<PrivacyPage />} />
                        <Route path={Paths.copyrightHoldersPage} element={<CopyrightHolders />} />
                        <Route path={Paths.mainPage} element={<MainPage />} />
                        <Route element={<NotFoundPage />} />
                    </Routes>
                    <Footer isDark={isDark} />
                </BrowserRouter>
            </React.Suspense>
        </div>
    );
};

export default AppRouter;
