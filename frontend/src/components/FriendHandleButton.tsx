import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonBackButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList, IonLabel, IonNote, IonAvatar } from '@ionic/react';
import { personAdd, personAddOutline, personRemoveOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import type { GroupTalk, Dm, TalkContent, Frienddoctype } from '../firebase/firestore';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { GetTalkdoc, GetSpeakerUidDict, DisplayNameandPhotoURL, GetDmdoc } from '../firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../reducks/store/store';
import AddFriendModal from './FriendHandleModal';

interface FriendHandleButtonProps {
    setIsModalOpen: (open: boolean) => void,
    buttonType: string,
    isModalOpen: boolean,
}

const FriendHandleButton : React.FC<FriendHandleButtonProps> = ({setIsModalOpen, isModalOpen, buttonType}) => {
    const dispatch = useDispatch<AppDispatch>();
    const maybefriends = useSelector((state: RootState) => state.maybefriends);
    const friends = useSelector((state: RootState) => state.friends);

    // const acceptFriend = () =>{
    //     dispatch({type: "ADD_FRIEND", payload: acceptFrienddata});
    //     dispatch({type: "REMOVE_MAYBEFRIEND", payload: acceptFrienddata});
    // };

    useEffect(() => {
        console.log("Friends", friends);
        console.log("MaybeFriends", maybefriends);
    })

    return(

        <IonButton slot="end" onClick={() => {setIsModalOpen(true)}} className='white-button'>
            <IonIcon icon={buttonType == "add" ? personAddOutline : personRemoveOutline}></IonIcon>
        </IonButton>
        

    );
};

export default FriendHandleButton;