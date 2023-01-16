// import { GoogleLogo } from 'components/shared/icons/GoogleLogo';
// import { SocialAuthParams } from 'domain/api/JsModels';
// import * as React from 'react';
// import {
//     GoogleLoginResponse,
//     GoogleLoginResponseOffline,
//     useGoogleLogin,
// } from 'react-google-login';
// import { login, UserClient } from 'redux/api/UserClient';
// import styles from './AuthGoogle.module.scss';

// interface Props {
//     className?: string;
//     googleAuth: SocialAuthParams;
// }

// export const AuthGoogle: React.FC<Props> = ({ className, googleAuth }) => {
//     const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
//         console.log('accessToken', response);
//         if ('accessToken' in response) {
//             const formData = new FormData();
//             formData.append('access_token', response.accessToken);
//             UserClient.loginViaGoogle(formData).then((res) => {
//                 console.log('res', res);
//                 login(res);
//             });
//         }
//     };

//     const { signIn } = useGoogleLogin({
//         onSuccess,
//         clientId: googleAuth.clientId,
//         redirectUri: googleAuth.redirectUri,
//         scope: googleAuth.scope,
//         responseType: googleAuth.responseType,
//     });

//     return (
//         <button className={styles.googleAuth__btn} onClick={signIn} title="google">
//             <GoogleLogo />
//         </button>
//     );
// };

// TODO: Доделать

export const AuthGoogle = () => {
    return <div>Auth Google</div>;
};
