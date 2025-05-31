import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged  } from 'firebase/auth';
import { auth , app, db } from './firebase/config'; 
import { useEffect } from 'react';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import ProtectRouter from './ProtectRouter';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { useState } from 'react';

setupIonicReact();
// createUserWithEmailAndPassword(auth, email, password)
//   .then(())

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<Object|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  auth.languageCode = 'ja';

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false); 
    });

    // クリーンアップ関数
    return () => unsubscribe();
    }, []);

  const ProcessLogin = () => {
    console.log(auth);
    //googleaccount認証
    signInWithPopup(auth, provider)
      .then((result) =>{
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        setUser(result.user);
        setIsLogin(true);
        console.log(result.user);
        console.log(typeof result.user);
      }).catch  ((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
  if (isLoading) {
    return (
      <IonApp>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      </IonApp>
    );
  }

  return(
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            {user ? <Redirect to="/home" /> : <Login ProcessLogin={ProcessLogin}/>}
          </Route>

          <Route exact path="/home">
            <ProtectRouter>
              <Home />
            </ProtectRouter>
          </Route>

          <Route exact path="/list">
            <ProtectRouter>
              <List />
            </ProtectRouter>
          </Route>

          <Route exact path="/">
            {user ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
