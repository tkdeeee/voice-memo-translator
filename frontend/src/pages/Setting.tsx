import { useEffect, useState, useRef } from 'react';
import { IonPage, IonHeader, IonTitle, IonContent, IonIcon, IonButton, IonImg, IonItem, IonToolbar, IonButtons, IonBackButton} from '@ionic/react';
import { logoGoogle, documentsOutline } from 'ionicons/icons';
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
                console.log(user);
            })
        }
    }, [user]);

    async function SignOut() {
        const auth = getAuth();
        signOut(auth).then(() =>{
            console.log("signout successful.");
        }).catch((error) =>{
            console.log("sign out failed.")
        });
    };

    async function handleCopy(text: string){
        await navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch((err) => {
            console.error('Failed to copy text:', err);
        });
    };

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/home'></IonBackButton>
                    </IonButtons>
                    <IonTitle>Setting</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {userdoc?
                    <div className="settingcontainer">
                        <IonImg class="ion-padding-top" src={userdoc.photoURL} alt="Your Icon Is Displayed here"></IonImg>
                        <IonItem>{userdoc.displayName}</IonItem>
                        <IonItem>{userdoc.email}</IonItem>
                        
                        <IonItem style={{marginBottom: "20px"}}>
                            <p style={{paddingRight: "10px"}}>{userdoc.uid}</p>
                            <IonButton  className='white-button' onClick={() => (user ? handleCopy(user.uid) : console.log("user is null."))}>
                                <IonIcon icon={documentsOutline}></IonIcon>
                            </IonButton>
                        </IonItem>
                        <IonButton onClick={SignOut}>Sign Out</IonButton>
                    </div>

                :
                    <IonItem>ユーザ情報を取得できませんでした</IonItem>
                }
                
            </IonContent>
        </IonPage>
    );
};

export default Setting;