import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import { auth , app, db } from './firebase/config'; 
import { getAuth, User } from 'firebase/auth';

import React from 'react';

type ProtectRouterProps = {
    children : React.ReactNode;
    user : User | null;
}

const ProtectRouter : React.FC<ProtectRouterProps> = ({children, user}) => {
    // const auth = getAuth();
    if (!user) {
        return (
            <Redirect to="/login" />
        );
    };
    return(
        <>{children}</>
    );
};

export default ProtectRouter;