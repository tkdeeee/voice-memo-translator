import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import { GetUserdoc } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Userdoctype, Group } from '../firebase/firestore';
import { settingsOutline } from 'ionicons/icons';


const Talk: React.FC = () => {
    const [grouplist, setGroupList] = useState<Group[]|null>(null);
    const [user, setUser] = useState(getAuth().currentUser);

    useEffect(() => {
        if(user?.uid){
            GetUserdoc(user.uid).then((userData) =>{
                if(userData?.group){
                    setGroupList(userData.group);
                    console.log(userData.group);
                }
            })
        }
    }, [user]);


    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>トーク</IonTitle>
                    <IonButton slot='end' routerLink='/setting'>
                        <IonIcon icon={settingsOutline}></IonIcon>  
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {grouplist?
                        grouplist.map((group: Group) =>(
                            <IonItem key={group.name} button >{group.name}</IonItem>
                        ))
                    :
                        <IonItem>グループがまだありません</IonItem>
                    }
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Talk;