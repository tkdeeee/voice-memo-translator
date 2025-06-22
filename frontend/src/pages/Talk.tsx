import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBackButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList, IonLabel, IonNote, IonAvatar } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, text, sendOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import type { GroupTalk, Dm, TalkContent } from '../firebase/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { GetTalkdoc, GetSpeakerUidDict, DisplayNameandPhotoURL, GetDmdoc } from '../firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../reducks/store/store';
import './Talk.css';


const Talk: React.FC = () => {
    const [grouptalk, setGroupTalk] = useState<GroupTalk|Dm|null>(null);
    const [speakerUidDict, setSpeakerUidDict] = useState<Record<string, DisplayNameandPhotoURL>>({});
    const [user, setUser] = useState(getAuth().currentUser);
    const { talktype, groupid } = useParams<{ talktype: string; groupid: string }>();
    const inputValue = useRef<HTMLIonTextareaElement>(null);
    const friends = useSelector((state: RootState) => state.friends); // Adjust the type according to your Redux store structure
    const dispatch = useDispatch();

    useEffect(() => {
        if(talktype == 'group'){
            GetTalkdoc(groupid).then((talkData) =>{
                if(talkData){
                    setGroupTalk(talkData);
                    console.log(talkData);

                    GetSpeakerUidDict(talkData.groupconfig.member).then((speakerUidDict) => {
                        if(speakerUidDict){
                            setSpeakerUidDict(speakerUidDict);
                            console.log(speakerUidDict);
                        };
                    });
                };
            });
            
        } else if(talktype == 'dm') {
            GetDmdoc(groupid).then((dmData) => {
                if(dmData){
                    setGroupTalk(dmData);
                    console.log(dmData);
                    GetSpeakerUidDict(dmData.member).then((speakerUidDict) => {
                        if(speakerUidDict){
                            setSpeakerUidDict(speakerUidDict);
                            console.log(speakerUidDict);
                        };
                    });
                };
            });
        }
    }, []);

    


    return(
        <>
            {grouptalk ? (
                <IonPage>
                    <IonHeader>
                        <IonToolbar class="ion-text-center">
                            <IonButtons slot='start'>
                                <IonBackButton defaultHref='/home'></IonBackButton>
                            </IonButtons>
                            <IonTitle>
                                {'groupconfig' in grouptalk
                                    ? grouptalk.groupconfig.name
                                    : friends.find(friend => friend.uid == (grouptalk.memberdict[user?.uid || ''] as string)?.[0])?.displayName || 'unknown friend'}
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent class='talkcontainer'>
                        <IonList lines='none' style={{display: "flex", flexDirection: "column"}}>
                            {grouptalk.talkhistory.map((talk, index) => {
                            return(   
                                talk.speakeruid == user?.uid ? (
                                    <IonItem key={index} className='own-message'>
                                        <div className='message-wrapper own'>
                                            <IonAvatar className='usericon'>
                                                <img alt="User Icon is displayed here!" src={speakerUidDict[talk.speakeruid]?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                            </IonAvatar>
                                            <div className='message-content'>
                                                <p className='username'>{speakerUidDict[talk.speakeruid]?.displayName || "Unknown User"}</p>
                                                <h1 className='message-text'>{talk.lettercontent}</h1>
                                            </div>
                                        </div>
                                    </IonItem>
                                ):(
                                    <IonItem key={index} className='other-message'>
                                        <div className='message-wrapper other'>
                                            <IonAvatar className='usericon'>
                                                <img alt="User Icon is displayed here!" src={speakerUidDict[talk.speakeruid]?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                            </IonAvatar>
                                            <div className='message-content'>
                                                <p className='username'>{speakerUidDict[talk.speakeruid]?.displayName || "Unknown User"}</p>
                                                <h1 className='message-text'>{talk.lettercontent}</h1>
                                            </div>
                                        </div>
                                    </IonItem>
                                )
                            )})}
                        </IonList>
                    </IonContent>
                    <IonFooter>
                        <IonToolbar style={{paddingLeft: "5px"}}>
                            <IonItem>
                                <IonTextarea ref={inputValue} placeholder='input message!'></IonTextarea>
                            </IonItem>
                            <IonButton slot='end' onClick={() => {
                                if(inputValue.current && inputValue.current.value) {
                                    if(inputValue.current.value.trim() !== "") {
                                        console.log("Sending message:", inputValue.current.value);
                                        const newTalkContent: TalkContent = {
                                            speakeruid: user?.uid || "",
                                            lettercontent: inputValue.current.value,
                                        };
                                        // Add the new talk content to the group talk
                                        if(grouptalk) {
                                            const updatedTalkHistory = [...grouptalk.talkhistory, newTalkContent];
                                            setGroupTalk({
                                                ...grouptalk,
                                                talkhistory: updatedTalkHistory
                                            });
                                            // Clear the input field
                                            inputValue.current.value = "";
                                            // Here you would typically also update the Firestore document with the new talk content
                                            console.log("New talk content added:", newTalkContent);
                                        }
                                        if(talktype == 'dm') {
                                            const dmDocRef = doc(db, 'dm', groupid);
                                            setDoc(dmDocRef, {talkhistory: [...grouptalk?.talkhistory || [], newTalkContent]}, {merge: true});
                                        }else if(talktype == 'group') {
                                            const talkDocRef = doc(db, 'talks', groupid);
                                            setDoc(talkDocRef, {talkhistory: [...grouptalk?.talkhistory || [], newTalkContent]}, {merge: true});
                                        }
                                    }
                                }}}>
                                <IonIcon slot="icon-only" icon={sendOutline} />
                            </IonButton>
                        </IonToolbar>
                    </IonFooter>
                </IonPage>
            ):(
                <></>
            )}
        </>
    );
};

export default Talk;