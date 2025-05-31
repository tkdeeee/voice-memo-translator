import { useEffect, useState, useRef } from 'react';
import { IonPage, IonHeader, IonTitle, IonContent, IonIcon, IonButton } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';

interface LoginProps {
    ProcessLogin : () => void;
}

const Login : React.FC<LoginProps> = ({ ProcessLogin }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);


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