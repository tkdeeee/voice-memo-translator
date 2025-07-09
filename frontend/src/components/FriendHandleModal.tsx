import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonList, IonItem, IonButton } from "@ionic/react";
import { Frienddoctype } from '../firebase/firestore';

interface FriendHandleProps {
    setIsModalOpen: (open: boolean) => void,
    isModalOpen: boolean,
    handledFriend: Frienddoctype,
    FriendHandler: () => void,
    handleType: "add" | "remove"
}

const FriendHandleModal: React.FC<FriendHandleProps> = ({ setIsModalOpen, isModalOpen, handledFriend, FriendHandler, handleType }) => {
    if (!isModalOpen) return null;
    return(
        <>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonTitle>友達を{handleType === "add" ? "追加" : "削除"}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                    <IonAvatar>
                        <img src={handledFriend.photoURL || "https://via.placeholder.com/150"} alt="Friend Avatar" />
                    </IonAvatar>
                    <IonList className='ion-padding'>
                        <IonItem>
                            <h2>{handledFriend.displayName || "Unknown User"}</h2>
                        </IonItem>
                        <IonItem>
                            <p>UID: {handledFriend.uid || "Unknown UID"}</p>
                        </IonItem>
                        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                            <IonButton onClick={() => {setIsModalOpen(false)}}>
                                キャンセル
                            </IonButton>
                            <IonButton onClick={() => {FriendHandler()}}>
                                {handleType === "add" ? "追加" : "削除"}
                            </IonButton>
                        </div>
                    </IonList>

                    
                </div>
            </IonContent>
        </>
    );    
};

export default FriendHandleModal;
