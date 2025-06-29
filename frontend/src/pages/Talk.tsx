import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBackButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList, IonLabel, IonNote, IonAvatar } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, text, sendOutline, send } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import type { GroupTalk, Dm, TalkContent, Frienddoctype } from '../firebase/firestore';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import AcceptMaybeFriend from '../components/AcceptMaybeFriend';
import { GetTalkdoc, GetSpeakerUidDict, DisplayNameandPhotoURL, GetDmdoc } from '../firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../reducks/store/store';
import './Talk.css';
import AddFriendModal from '../components/AddFriendModal';
import VoiceRecorderButton from '../components/VoiceRecorderButton';
import VoiceRecorderModal from '../components/VoiceRecorderModal';
import { handleRecordingComplete } from './Home';
import VoicePreviewComponent from '../components/VoicePreviewComponent';


const Talk: React.FC = () => {
    const [grouptalk, setGroupTalk] = useState<GroupTalk|Dm|null>(null);
    const [speakerUidDict, setSpeakerUidDict] = useState<Record<string, DisplayNameandPhotoURL>>({});
    const [user, setUser] = useState(getAuth().currentUser);
    const { talktype, groupid } = useParams<{ talktype: string; groupid: string }>();
    const inputValue = useRef<HTMLIonTextareaElement>(null);
    const ionContentRef = useRef<HTMLIonContentElement>(null);
    const friends = useSelector((state: RootState) => state.friends);
    const maybefriends = useSelector((state: RootState) => state.maybefriends);
    const [maybeFriend, setMaybeFriend] = useState<Frienddoctype|undefined>(undefined);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);
    const [isVoiceRecorderModalOpen, setIsVoiceRecorderModalOpen] = useState<boolean>(false);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const recorderRef = useRef<any>(null);

    const acceptFriend = () =>{
        if(maybeFriend){
            dispatch({type: "ADD_FRIEND", payload: maybeFriend});
            dispatch({type: "REMOVE_MAYBEFRIEND", payload: maybeFriend.uid});
            setIsAddFriendModalOpen(false);
        }
    };

    const sendMessage = () => {
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
                const talkDocRef = doc(db, talktype, groupid);
                grouptalk && setDoc(talkDocRef, {talkhistory: [...grouptalk.talkhistory|| [], newTalkContent]}, {merge: true});
            }
        }
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const talkDocRef = doc(db, talktype, groupid);
        unsubscribe = onSnapshot(talkDocRef, (snapshot) => {
            const data = snapshot.data();
            if (data) {
                if ('groupconfig' in data ){
                    setGroupTalk(data as GroupTalk);
                    GetSpeakerUidDict(data.groupconfig.member).then((speakerUidDict) => {
                        if(speakerUidDict){
                            setSpeakerUidDict(speakerUidDict);
                        }
                    });
                }else if('member' in data ){
                    setGroupTalk(data as Dm);
                    GetSpeakerUidDict(data.member).then((speakerUidDict) => {
                        if(speakerUidDict){
                            setSpeakerUidDict(speakerUidDict);
                            console.log(speakerUidDict);
                        }
                    });
                }
            }
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (ionContentRef.current){
            ionContentRef.current.scrollToBottom(300);
        }
    }, [grouptalk?.talkhistory]);

    useEffect(() => {
        if (user && grouptalk){
            if ("member" in grouptalk){
                setMaybeFriend(maybefriends.find((maybefriend) => maybefriend.uid == grouptalk.memberdict[user.uid]));
                console.log("grouptalk.memberdict[user.uid]", grouptalk?.memberdict[user.uid]);
            }
        }
    }, [grouptalk])

    useEffect(() => {
        console.log(maybefriends);
        console.log("maybefriend", maybeFriend);
    }, [maybeFriend])

    


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
                                {('groupconfig' in grouptalk)
                                    ? grouptalk.groupconfig.name
                                    : (user && speakerUidDict[grouptalk.memberdict[user.uid]]?.displayName) || 'unknown friend'}
                            </IonTitle>
                            {'member' in grouptalk ?
                                maybeFriend ? <AcceptMaybeFriend setIsModalOpen={setIsAddFriendModalOpen} isModalOpen={isAddFriendModalOpen}/> : <></>
                            :   
                                <></>
                            }
                            
                        </IonToolbar>
                    </IonHeader>
                    <IonContent class='talkcontainer' ref={ionContentRef} >
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
                        <IonModal 
                            isOpen={isAddFriendModalOpen || isVoiceRecorderModalOpen} 
                            initialBreakpoint={0.4} 
                            breakpoints={[0, 0.4, 1]}
                            onDidDismiss={() => {
                                setIsAddFriendModalOpen(false);
                                setIsVoiceRecorderModalOpen(false);
                                recorderRef.current?.stopRecording();
                            }}
                            style={{width: "430px", margin: "0 auto"}}
                        >
                            {maybeFriend &&
                            <AddFriendModal 
                                setIsModalOpen={setIsAddFriendModalOpen}
                                isModalOpen={isAddFriendModalOpen} 
                                addedFriend={maybeFriend} 
                                AddFriendProcess={acceptFriend}
                            />}
                            <VoiceRecorderModal
                                onRecordingComplete={handleRecordingComplete}
                                setPermissionGranted={setPermissionGranted}
                                permissionGranted={permissionGranted}
                                setIsVoiceRecorderModalopen={setIsVoiceRecorderModalOpen}
                                isVoiceRecorderModalopen={isVoiceRecorderModalOpen}
                                ref={recorderRef}
                            />


                        </IonModal>
                    </IonContent>
                    <IonFooter>
                        <IonToolbar style={{paddingLeft: "5px"}}>
                            <div className='footer-items'>
                                {/* <div className='input-message'>
                                    <IonTextarea ref={inputValue} placeholder='input message!'></IonTextarea>
                                </div> */}
                                <div className="input-button">
                                    <VoiceRecorderButton 
                                        setIsModalopen={setIsVoiceRecorderModalOpen} 
                                        isModalopen={isVoiceRecorderModalOpen}
                                        setPermissionGranted={setPermissionGranted}
                                        permissionGranted={permissionGranted}
                                    />
                                
                                    {/* <IonButton onClick={sendMessage}>
                                        <IonIcon slot="icon-only" icon={sendOutline} />
                                    </IonButton> */}
                                </div>
                                <VoicePreviewComponent
                                    voiceData={""}
                                />
                                
                            </div>
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