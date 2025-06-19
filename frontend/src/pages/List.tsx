import { IonContent, IonHeader, IonPage,IonBackButton, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, addOutline, duplicateOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import { GetUserdoc } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Userdoctype, GroupList } from '../firebase/firestore';
import { settingsOutline } from 'ionicons/icons';


const List: React.FC = () => {
    const [grouplist, setGroupList] = useState<GroupList[]|null>(null);
    const [user, setUser] = useState(getAuth().currentUser);

    useEffect(() => {
        if(user?.uid){
            GetUserdoc(user.uid).then((userData) =>{
                if(userData?.group){
                    setGroupList(userData.group);
                    console.log(userData.group);
                };
            });
        };
    }, [user]);


    return(
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/home'></IonBackButton>
                    </IonButtons>
                    <IonTitle>トーク</IonTitle>
                    <IonButton slot='end' routerLink='/friend/add' className="white-button">
                        <IonIcon icon={addOutline}></IonIcon>  
                    </IonButton>
                    <IonButton slot='end' routerLink='/setting' className="white-button">
                        <IonIcon icon={duplicateOutline}></IonIcon>  
                    </IonButton>
                    <IonButton slot='end' routerLink='/setting' className="white-button">
                        <IonIcon icon={settingsOutline}></IonIcon>  
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {grouplist?
                        grouplist.map((group: GroupList) =>(
                            <IonItem key={group.name} button routerLink={`/talk/${group.groupid}`}>{group.name}</IonItem>
                        ))
                    :
                        <IonItem>グループがまだありません</IonItem>
                    }
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default List;