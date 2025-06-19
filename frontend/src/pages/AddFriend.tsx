import { IonContent, IonHeader, IonPage,IonBackButton, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, addOutline, duplicateOutline, checkmarkOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import { GetUserdoc } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Userdoctype, GroupList } from '../firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { h } from 'ionicons/dist/types/stencil-public-runtime';
import './AddFriend.css';


const AddFriend: React.FC = () => {
    const [user, setUser] = useState(getAuth().currentUser);
    const inputValue = useRef<HTMLIonInputElement>(null);
    const [inputID, setInputID] = useState<string>("");

    const handleInputChange = (event: CustomEvent) => {
        const value = event.detail.value as string;
        setInputID(value);
        console.log("Input Value:", value);
    };

    useEffect(() => {
        console.log("Input Value:", inputID);
        if(inputID.length == 20){

        }
    }, [inputID]);


    return(
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/home'></IonBackButton>
                    </IonButtons>
                    <IonTitle>友達を追加</IonTitle>
                    <IonButton slot='end' routerLink='/setting' className="white-button">
                        <IonIcon icon={settingsOutline}></IonIcon>  
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="center-content">
                    <IonItem style={{}} lines='none'>
                        <IonInput
                            ref={inputValue} 
                            counter={true} 
                            maxlength={20} 
                            class='ion-padding' 
                            placeholder="友達のIDを入力して！"
                            onIonInput={handleInputChange}
                            counterFormatter={(inputLength, maxLength) => inputLength == 20 ? "OK!" : `文字数不足: ${inputLength}/${maxLength}`}
                        ></IonInput>
                        <IonButton 
                            onClick={() => console.log("Input Value:", inputValue.current?.value)}
                            disabled={inputID.length !== 20}
                        >
                            <IonIcon icon={checkmarkOutline}></IonIcon>
                        </IonButton>
                    </IonItem>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AddFriend;