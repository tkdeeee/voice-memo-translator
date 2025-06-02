import { useEffect, useState, useRef } from 'react';
import { IonPage, IonHeader, IonTitle, IonContent, IonIcon, IonButton } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User  } from 'firebase/auth';
import { auth , app, db } from '../firebase/config'; 


// interface LoginProps {
//     // ProcessLogin : () => void;
//     user: Object | null;
//     isLogin: boolean;
//     setUser: (user: User|null) => void;
//     setIsLogin: (isLogin: boolean) => void;
// }

const Login : React.FC = ({}) => {

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    const ProcessLogin = () => {
    // console.log(auth);
    //googleaccount認証
    signInWithPopup(auth, provider)
      .then((result) =>{
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        sessionStorage.setItem("fromLogin", "true");
        // console.log(result.user);
        // console.log(typeof result.user);
      }).catch  ((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };


    return (
        <IonPage>
            <IonHeader>
                <IonTitle>
                    ログイン
                </IonTitle>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <div className='container'>
                    <IonButton onClick={ProcessLogin}>
                        <IonIcon slot="start" icon={logoGoogle}/>Googleでログイン
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;