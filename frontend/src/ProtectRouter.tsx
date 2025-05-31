import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import { auth , app, db } from './firebase/config'; 
import { getAuth } from 'firebase/auth';

import React from 'react';

type ProtectRouterProps = {
    children : React.ReactNode;
    // user : UesrType 
}

const ProtectRouter : React.FC<ProtectRouterProps> = ({children, }) => {
    const auth = getAuth();
    if (!auth.currentUser) {
        return (
            <Redirect to="/login" />
        );
    };
    return(
        <>{children}</>
    );
};

export default ProtectRouter;