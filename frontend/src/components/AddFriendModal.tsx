import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonList, IonItem, IonButton } from "@ionic/react";
import { Frienddoctype } from '../firebase/firestore';

interface AddFriendProps {
    setIsModalOpen: (open: boolean) => void,
    isModalOpen: boolean,
    addedFriend: Frienddoctype,
    AddFriendProcess: () => void
}

const AddFriendModal: React.FC<AddFriendProps> = ({ setIsModalOpen, isModalOpen, addedFriend, AddFriendProcess }) => {
    if (!isModalOpen) return null;
    return(
        <>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonTitle>友達を追加</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                    <IonAvatar>
                        <img src={addedFriend.photoURL || "https://via.placeholder.com/150"} alt="Friend Avatar" />
                    </IonAvatar>
                    <IonList className='ion-padding'>
                        <IonItem>
                            <h2>{addedFriend.displayName || "Unknown User"}</h2>
                        </IonItem>
                        <IonItem>
                            <p>UID: {addedFriend.uid || "Unknown UID"}</p>
                        </IonItem>
                        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                            <IonButton onClick={() => {setIsModalOpen(false)}}>
                                キャンセル
                            </IonButton>
                            <IonButton onClick={() => {AddFriendProcess()}}>
                                追加
                            </IonButton>
                        </div>
                    </IonList>

                    
                </div>
            </IonContent>
        </>
    );    
};

export default AddFriendModal;
