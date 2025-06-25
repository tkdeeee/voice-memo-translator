import { IonContent, IonHeader, IonPage,IonBackButton, IonTitle, IonAvatar, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList } from '@ionic/react';
import { useEffect, useState, useRef } from 'react';
import { GetFrienddoc, CreateDMdoc, UpdateFrienddoc, UpdateMaybeFrienddoc } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Userdoctype, GroupList, Frienddoctype } from '../firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { h } from 'ionicons/dist/types/stencil-public-runtime';
import './AddFriend.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../reducks/store/store';
import AddFriendModal from '../components/AddFriendModal';


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

    async function AddFriend() {
        
        if(user?.uid && friendData){
            const dmid = await CreateDMdoc(user.uid, friendData);
            console.log("DM created with ID:", dmid);
            friendData.dmid = dmid; // Add dmid to friendData

            await UpdateFrienddoc(user.uid, friendData);
            console.log("Friend added successfully:", friendData);
            if (user.displayName && user.photoURL) {
                const userData = {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    dmid: dmid, // Add dmid to userData
                };
                await UpdateMaybeFrienddoc(friendData.uid, userData);
                console.log("Maybe friend updated successfully:", userData);
            }
            dispatch({ type: 'ADD_FRIEND', payload: friendData });
        }
        setIsModalOpen(false);
    };

    useEffect(() => {
        console.log("Input Value:", inputID);
        if(inputID.length == 28 || 20){
            console.log(user?.uid);
            console.log("Friends:", friends);
            if(inputID !== user?.uid && (friends.some((friend: Frienddoctype) => friend.uid !== inputID) || friends.length === 0)){
                GetFrienddoc(inputID).then((friendData) => {
                    if(friendData){
                        console.log("Friend data found:", friendData);
                        setFriendData(friendData);
                        if(inputValue.current){
                            inputValue.current.value = "";
                        }
                        setInputID("");
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
                            maxlength={28} 
                            class='ion-padding' 
                            placeholder="友達のIDを入力して！"
                            onIonInput={handleInputChange}
                            counterFormatter={(inputLength, maxLength) => 
                                inputLength == 28 ? "OK!" : `文字数不足: ${inputLength}/${maxLength}`
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

                {/* <IonModal 
                    isOpen={isModalOpen} 
                    // onDidDismiss={() => {
                    //     if(inputValue.current?.value){
                    //         inputValue.current.value = "";
                    //     }
                    // }}
                    initialBreakpoint={0.4} 
                    breakpoints={[0, 0.4, 1]}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>友達を追加</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent class="ion-padding">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                            <IonAvatar>
                                <img src={friendData?.photoURL || "https://via.placeholder.com/150"} alt="Friend Avatar" />
                            </IonAvatar>
                            <IonList className='ion-padding'>
                                <IonItem>
                                    <h2>{friendData?.displayName || "Unknown User"}</h2>
                                </IonItem>
                                <IonItem>
                                    <p>UID: {friendData?.uid || "Unknown UID"}</p>
                                </IonItem>
                                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                    <IonButton onClick={() => {setIsModalOpen(false)}}>
                                        キャンセル
                                    </IonButton>
                                    <IonButton onClick={() => {AddFriend()}}>
                                        追加
                                    </IonButton>
                                </div>
                            </IonList>

                            
                        </div>
                    </IonContent>
                </IonModal> */}
                <IonModal 
                            isOpen={isModalOpen} 
                            initialBreakpoint={0.4} 
                            breakpoints={[0, 0.4, 1]}
                >
                    {friendData && <AddFriendModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} addedFriend={friendData} AddFriendProcess={AddFriend}/>}
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default AddFriend;