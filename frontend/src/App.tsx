import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User  } from 'firebase/auth';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { auth , app, db } from './firebase/config'; 
import { useEffect } from 'react';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import Setting from './pages/Setting';
import AddFriend from './pages/AddFriend';
import ProtectRouter from './ProtectRouter';
import Talk from './pages/Talk';
import { CreateUserdoc } from './firebase/firestore';
import './App.css';

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
  const [user, setUser] = useState<User|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user);
    setUser(user);
    setIsLoading(false);
    if(user && user.displayName && user.photoURL && user.email){
      const userObject = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        group: [],
        friends: [],
        maybefriends: []
      };
      CreateUserdoc(userObject);
    };
  });

  // クリーンアップ関数
  return () => unsubscribe();
  }, []);


  if (isLoading) {
    return (
        <IonApp>
          <div className='app-mobile-frame'>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              Loading...
            </div>
          </div>
        </IonApp>
    );
  }

  return(
    <IonApp>
      <div className='app-mobile-frame'>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              {user ? <Redirect to="/list" /> : <Login/>}
            </Route>

            {/* <Route exact path="/home">
              <ProtectRouter user = {user}>
                <Home />
              </ProtectRouter>
            </Route> */}

            <Route exact path="/list">
              <ProtectRouter user = {user}>
                <List />
              </ProtectRouter>
            </Route>

            <Route path="/talk/:talktype/:groupid">
              <ProtectRouter user = {user}>
                <Talk />
              </ProtectRouter>
            </Route>

            <Route exact path="/setting">
              <ProtectRouter user = {user}>
                <Setting />
              </ProtectRouter>
            </Route>

            <Route exact path="/friend/add">
              <ProtectRouter user = {user}>
                <AddFriend />
              </ProtectRouter>
            </Route>

            <Route exact path="/">
              {user ? <Redirect to="/list" /> : <Redirect to="/login" />}
            </Route>

          </IonRouterOutlet>
        </IonReactRouter>
      </div>
    </IonApp>
  );
};

export default App ;
