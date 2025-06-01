import { useEffect, useState, useRef } from 'react';
import { IonPage, IonHeader, IonTitle, IonContent, IonIcon, IonButton, IonImg, IonItem, IonToolbar, IonButtons, IonBackButton} from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { GetUserdoc } from '../firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import type { Userdoctype } from '../firebase/firestore';
import './Setting.css';


const Setting: React.FC = () => {
    const [userdoc, setUserdoc] = useState<Userdoctype|null>(null);
    const [user, setUser] = useState(getAuth().currentUser);

    useEffect(() => {
        if(user?.uid){
            GetUserdoc(user.uid).then((userData) =>{
                setUserdoc(userData);
                if(userData){
                    console.log(userData.photoURL);
                };
            })
        }
    }, [user]);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/home'></IonBackButton>
                    </IonButtons>
                    <IonTitle class="ion-text-center">Setting</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {userdoc?
                    <div className="container">
                        <IonImg src={userdoc.photoURL} alt="Your Icon Is Displayed here"></IonImg>
                        <IonItem>{userdoc.displayName}</IonItem>
                        <IonItem>{userdoc.email}</IonItem>
                    </div>

                :
                    <IonItem>ユーザ情報を取得できませんでした</IonItem>
                }
                
            </IonContent>
        </IonPage>
    );
};

export default Setting;