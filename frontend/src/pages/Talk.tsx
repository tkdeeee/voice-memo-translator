import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import type { GroupTalk, TalkContent } from '../firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import { GetTalkdoc } from '../firebase/firestore';


const Talk: React.FC = () => {
    const [grouptalk, setGroupTalk] = useState<GroupTalk|null>(null);
    const [user, setUser] = useState(getAuth().currentUser);
    const {groupid} = useParams<{ groupid: string}>();

    useEffect(() => {
        GetTalkdoc(groupid).then((talkData) =>{
            if(talkData){
                setGroupTalk(talkData);
                
            };
        });
    }, []);


    return(
        <>
            {grouptalk ? (
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{grouptalk.name}</IonTitle>
                            <IonButton slot='end' routerLink='/setting'>
                                <IonIcon icon={settingsOutline}></IonIcon>  
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {grouptalk.talkhistory.map((talk, index) => {
                           return <IonItem key={index}>{talk.lettercontent}</IonItem>
                        })}
                    </IonContent>
                </IonPage>
            ):(
                <></>
            )}
        </>
    );
};

export default Talk;