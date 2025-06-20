import { IonContent, IonHeader, IonPage,IonBackButton, IonTitle, IonAvatar, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, addOutline, duplicateOutline, checkmarkOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import { GetUserdoc, GetFrienddoc } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Userdoctype, GroupList, Frienddoctype } from '../firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { h } from 'ionicons/dist/types/stencil-public-runtime';
import './AddFriend.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../reducks/store/store';


const AddFriend: React.FC = () => {
    const [user, setUser] = useState(getAuth().currentUser);
    const inputValue = useRef<HTMLIonInputElement>(null);
    const [inputID, setInputID] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const friends = useSelector((state: RootState) => state.friends);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [friendData, setFriendData] = useState<Frienddoctype|null>(null);

    const handleInputChange = (event: CustomEvent) => {
        const value = event.detail.value as string;
        setInputID(value);
        console.log("Input Value:", value);
    };

    useEffect(() => {
        console.log("Input Value:", inputID);
        if(inputID.length == 20){
            if(inputID !== user?.uid && friends.some((friend: Frienddoctype) => friend.uid !== inputID)){
                GetFrienddoc(inputID).then((friendData) => {
                    if(friendData){
                        console.log("Friend data found:", friendData);
                        setFriendData(friendData);
                        if(inputValue.current){
                            inputValue.current.value = "";
                        }
                        setIsModalOpen(true);
                    } else {
                        console.log("Friend already exists or invalid ID.");
                    }
                }).catch((error) => {
                    console.error("Error fetching friend data:", error);
                });
            };
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
                            counterFormatter={(inputLength, maxLength) => 
                                inputLength == 20 ? "OK!" : `文字数不足: ${inputLength}/${maxLength}`
                            }
                        ></IonInput>
                        {/* <IonButton 
                            onClick={() => console.log("Input Value:", inputValue.current?.value)}
                            disabled={inputID.length !== 20}
                        >
                            <IonIcon icon={checkmarkOutline}></IonIcon>
                        </IonButton> */}
                    </IonItem>
                </div>

                <IonModal 
                    isOpen={isModalOpen} 
                    // onDidDismiss={() => {
                    //     if(inputValue.current?.value){
                    //         inputValue.current.value = "";
                    //     }
                    // }}
                    initialBreakpoint={0.5} 
                    breakpoints={[0, 0.5, 1]}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>友達を追加</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonAvatar>
                            <img src={friendData?.photoURL || "https://via.placeholder.com/150"} alt="Friend Avatar" />
                        </IonAvatar>
                        <IonList>
                            <IonItem>
                                <h2>{friendData?.displayName || "Unknown User"}</h2>
                            </IonItem>
                            <IonItem>
                                <p>UID: {friendData?.uid || "Unknown UID"}</p>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default AddFriend;