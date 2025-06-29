import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBackButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList, IonLabel, IonNote, IonAvatar } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, text, sendOutline, send } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import type { GroupTalk, Dm, TalkContent, Frienddoctype, VoiceContent, DmVoice } from '../firebase/firestore';
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
import VoicePreviewComponent from '../components/VoicePreviewComponent';
import VoiceViewComponent from '../components/VoiceViewComponent';

export type voiceDataType = {
    recordDataBase64: string,
    mimeType: string,
    msDuration: number,
};


const Talk: React.FC = () => {
    // const [grouptalk, setGroupTalk] = useState<GroupTalk|Dm|null>(null);
    const [groupVoicetalk, setGroupVoiceTalk] = useState<DmVoice|null>(null);
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
    const [voiceData, setVoiceData] = useState<voiceDataType|null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const recorderRef = useRef<any>(null);

    const acceptFriend = () =>{
        if(maybeFriend){
            dispatch({type: "ADD_FRIEND", payload: maybeFriend});
            dispatch({type: "REMOVE_MAYBEFRIEND", payload: maybeFriend.uid});
            setIsAddFriendModalOpen(false);
        }
    };

    // const sendMessage = () => {
    //     if(inputValue.current && inputValue.current.value) {
    //         if(inputValue.current.value.trim() !== "") {
    //             console.log("Sending message:", inputValue.current.value);
    //             const newTalkContent: TalkContent = {
    //                 speakeruid: user?.uid || "",
    //                 lettercontent: inputValue.current.value,
    //             };
    //             // Add the new talk content to the group talk
    //             if(grouptalk) {
    //                 const updatedTalkHistory = [...grouptalk.talkhistory, newTalkContent];
    //                 setGroupTalk({
    //                     ...grouptalk,
    //                     talkhistory: updatedTalkHistory
    //                 });
    //                 // Clear the input field
    //                 inputValue.current.value = "";
    //                 // Here you would typically also update the Firestore document with the new talk content
    //                 console.log("New talk content added:", newTalkContent);
    //             }
    //             const talkDocRef = doc(db, talktype, groupid);
    //             grouptalk && setDoc(talkDocRef, {talkhistory: [...grouptalk.talkhistory|| [], newTalkContent]}, {merge: true});
    //         }
    //     }
    // };

    const sendVoice = () => {
            if(voiceData && voiceData.recordDataBase64 && voiceData.mimeType && voiceData.msDuration > 0) {
                console.log("Sending message:", voiceData);
                const newVoiceContent: VoiceContent = {
                    speakeruid: user?.uid || "",
                    voiceData: voiceData,
                };
                // Add the new talk content to the group talk
                if(groupVoicetalk) {
                    const updatedVoiceHistory = [...groupVoicetalk.talkhistory, newVoiceContent];
                    setGroupVoiceTalk({
                        ...groupVoicetalk,
                        talkhistory: updatedVoiceHistory
                    });
                    // Here you would typically also update the Firestore document with the new talk content
                    console.log("New talk content added:", newVoiceContent);
                }
                const talkDocRef = doc(db, talktype, groupid);
                groupVoicetalk && setDoc(talkDocRef, {talkhistory: [...groupVoicetalk.talkhistory|| [], newVoiceContent]}, {merge: true});
                setVoiceData(null);
            }
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const talkDocRef = doc(db, talktype, groupid);
        unsubscribe = onSnapshot(talkDocRef, (snapshot) => {
            const data = snapshot.data();
            console.log("Talk data received:", data);
            if (data) {
                // if ('groupconfig' in data ){
                //     setGroupTalk(data as GroupTalk);
                //     GetSpeakerUidDict(data.groupconfig.member).then((speakerUidDict) => {
                //         if(speakerUidDict){
                //             setSpeakerUidDict(speakerUidDict);
                //         }
                //     });
                // }else 
                if ('member' in data) {
                    setGroupVoiceTalk(data as DmVoice);
                    GetSpeakerUidDict(data.member).then((speakerUidDict) => {
                        if(speakerUidDict){
                            setSpeakerUidDict(speakerUidDict);
                            console.log(speakerUidDict);
                        }
                    });
                }
                // }else if('member' in data ){
                //     setGroupTalk(data as Dm);
                //     GetSpeakerUidDict(data.member).then((speakerUidDict) => {
                //         if(speakerUidDict){
                //             setSpeakerUidDict(speakerUidDict);
                //             console.log(speakerUidDict);
                //         }
                //     });
                // }
            }   
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // useEffect(() => {
    //     if (ionContentRef.current){
    //         ionContentRef.current.scrollToBottom(300);
    //     }
    // }, [grouptalk?.talkhistory]);

    // useEffect(() => {
    //     if (user && grouptalk){
    //         if ("member" in grouptalk){
    //             setMaybeFriend(maybefriends.find((maybefriend) => maybefriend.uid == grouptalk.memberdict[user.uid]));
    //             console.log("grouptalk.memberdict[user.uid]", grouptalk?.memberdict[user.uid]);
    //         }
    //     }
    // }, [grouptalk])

    useEffect(() => {
        if (user && groupVoicetalk){
            if ("member" in groupVoicetalk){
                setMaybeFriend(maybefriends.find((maybefriend) => maybefriend.uid == groupVoicetalk.memberdict[user.uid]));
                console.log("groupVoicetalk.memberdict[user.uid]", groupVoicetalk?.memberdict[user.uid]);
            }
        }
    }, [groupVoicetalk])

    useEffect(() => {
        console.log(maybefriends);
        console.log("maybefriend", maybeFriend);
    }, [maybeFriend])

    


    return(
        <>
            {groupVoicetalk ?
                <IonPage>
                    <IonHeader>
                        <IonToolbar class="ion-text-center">
                            <IonButtons slot='start'>
                                <IonBackButton defaultHref='/list'></IonBackButton>
                            </IonButtons>
                            <IonTitle>
                                {(user && speakerUidDict[groupVoicetalk.memberdict[user.uid]]?.displayName) || 'unknown friend'}
                            </IonTitle>
                            {'member' in groupVoicetalk ?
                                maybeFriend ? <AcceptMaybeFriend setIsModalOpen={setIsAddFriendModalOpen} isModalOpen={isAddFriendModalOpen}/> : <></>
                            :   
                                <></>
                            }
                            
                        </IonToolbar>
                    </IonHeader>
                    <IonContent class='talkcontainer' ref={ionContentRef} >
                        <IonList lines='none' style={{display: "flex", flexDirection: "column"}}>
                            {groupVoicetalk && groupVoicetalk.talkhistory.map((voice, index) => {
                                return(
                                    voice.speakeruid == user?.uid ? (
                                        <IonItem key={index} className='own-message'>
                                            <div className='message-wrapper own'>
                                                <IonAvatar className='usericon'>
                                                    <img alt="User Icon is displayed here!" src={speakerUidDict[voice.speakeruid]?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                                </IonAvatar>
                                                <div className='message-content'>
                                                    <p className='username'>{speakerUidDict[voice.speakeruid]?.displayName || "Unknown User"}</p>
                                                    < VoiceViewComponent
                                                        voiceData={voice.voiceData}
                                                        own={true}
                                                    />
                                                </div>
                                            </div>
                                        </IonItem>
                                    ):(
                                        <IonItem key={index} className='other-message'>
                                            <div className='message-wrapper other'>
                                                <IonAvatar className='usericon'>
                                                    <img alt="User Icon is displayed here!" src={speakerUidDict[voice.speakeruid]?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                                </IonAvatar>
                                                <div className='message-content'>
                                                    <p className='username'>{speakerUidDict[voice.speakeruid]?.displayName || "Unknown User"}</p>
                                                    < VoiceViewComponent
                                                        voiceData={voice.voiceData}
                                                        own={false}
                                                    />
                                                </div>
                                            </div>
                                        </IonItem>
                                    )
                                );
                            })}
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
                            {!voiceData &&
                            <VoiceRecorderModal
                                setPermissionGranted={setPermissionGranted}
                                permissionGranted={permissionGranted}
                                setIsVoiceRecorderModalopen={setIsVoiceRecorderModalOpen}
                                isVoiceRecorderModalopen={isVoiceRecorderModalOpen}
                                ref={recorderRef}
                                setVoiceData={setVoiceData}
                            />
                            }


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
                                        voiceData={voiceData}
                                    />
                                
                                    
                                </div>
                                { voiceData && voiceData.recordDataBase64 && voiceData.mimeType && voiceData.msDuration > 0 &&
                                <>
                                    <VoicePreviewComponent
                                        setVoiceData={setVoiceData}
                                        voiceData={voiceData}
                                    />
                                    <IonButton onClick={sendVoice}>
                                        <IonIcon slot="icon-only" icon={sendOutline} />
                                    </IonButton>
                                </>
                                }
                            </div>
                        </IonToolbar>
                    </IonFooter>
                </IonPage>
            :(
                <></>
            )
            }
        </>
    );
};

export default Talk;