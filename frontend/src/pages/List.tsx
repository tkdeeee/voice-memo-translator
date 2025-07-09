import { IonContent, IonHeader, IonPage, IonLabel, IonItemDivider, IonBackButton, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput, IonList, IonAvatar } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, addOutline, duplicateOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { auth, app, db } from '../firebase/config';
import VoiceRecorderComponent from '../components/VoiceRecorder';
import { Frienddoctype, Userdoctype, GroupList, CreateUserdoc } from '../firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { settingsOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../reducks/store/store';
import './Home.css';

const List: React.FC = () => {
    const [grouplist, setGroupList] = useState<GroupList[]|null>(null);
    const [user, setUser] = useState(getAuth().currentUser);
    const dispatch = useDispatch<AppDispatch>();
    const friends = useSelector((state: RootState) => state.friends);
    const maybefriends = useSelector((state: RootState) => state.maybefriends);
    // const userBasicInfo = useSelector((state: RootState) => state.userBasicInfo);

    const friendsRef = useRef(friends);
    friendsRef.current = friends;

    const maybefriendsRef = useRef(maybefriends);
    maybefriendsRef.current = maybefriends;

    useEffect(() => {
        let unsubscribe: Unsubscribe;
        if(user?.uid){
            const userDocRef = doc(db, "users", user.uid);
            unsubscribe = onSnapshot(userDocRef, (snapshot) => {
                const userdata = snapshot.data() as Userdoctype;
                if(userdata){
                    console.log(friendsRef.current);
                    userdata.friends.map((friend: Frienddoctype) => {
                        const friendDocRef = doc(db, "public_profiles", friend.uid);
                        getDoc(friendDocRef).then((friendSnapshot) => {
                            if (friendSnapshot.exists()) {
                                const friendData = {...friendSnapshot.data(), dmid: friend.dmid} as Frienddoctype;
                                if (friendsRef.current.find(f => f.uid == friendData.uid)) {
                                    console.warn(`Friend with uid ${friendData.uid} already exists.`);
                                }else {
                                    dispatch({ type: 'ADD_FRIEND', payload: { ...friend, ...friendData } });
                                    console.log("ADDED friend !");
                                }   
                                
                                console.log("Friend data:", friendData);
                            } else {
                                console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.error("Error getting document:", error);
                        });
                    });
                    userdata.maybefriends.map((maybefriend: Frienddoctype) => {
                        const maybefriendDocRef = doc(db, "public_profiles", maybefriend.uid);
                        getDoc(maybefriendDocRef).then((maybefriendSnapshot) => {
                            if (maybefriendSnapshot.exists()) {
                                const maybefriendData = {...maybefriendSnapshot.data(), dmid: maybefriend.dmid} as Frienddoctype;
                                if (maybefriendsRef.current.find(f => f.uid == maybefriendData.uid)) {
                                    console.warn(`MaybeFriend with uid ${maybefriendData.uid} already exists.`);
                                }else {
                                    dispatch({ type: 'ADD_MAYBEFRIEND', payload: { ...maybefriend, ...maybefriendData } });
                                    console.log("ADDED MaybeFriend !");
                                }   
                                
                                console.log("MaybeFriend data:", maybefriendData);
                            } else {
                                console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.error("Error getting document:", error);
                        });
                    });
                    setGroupList(userdata.group);
                    // dispatch({ type: 'FETCH_FRIENDS', payload: userdata.friends });
                    // dispatch({ type: 'FETCH_MAYBEFRIENDS', payload: userdata.maybefriends });
                    // const { uid, displayName, photoURL, email } = userdata;
                    // console.log(uid, displayName, photoURL, email); 
                    // dispatch({ type: 'FETCH_SELF_PROFILE', payload: {uid, displayName, photoURL, email}});
                }
            })
            // GetUserdoc(user.uid).then((userData) =>{
            //     if(userData?.group){
            //         setGroupList(userData.group);
            //         console.log(userData.group);
            //         console.log(friends);
            //     }
            //     if(userData?.friends){
            //         dispatch({ type: 'FETCH_FRIENDS', payload: userData.friends });
                    
            //     }
            //     if(userData?.maybefriends){
            //         setMaybeFriends(userData.maybefriends as Frienddoctype[]);
            //     }
            // });

            // GetUserdoc("testfriend").then((userData) =>{
            //     if(userData?.group){
            //         console.log("Test friend:", userData);
            //         const testfriend = {
            //             ...userData,
            //             uid: "testfriendtestfriend",
            //         }
            //         CreateUserdoc(testfriend).then(() => {
            //             console.log("Test friend created successfully.");
            //         }).catch((error) => {
            //             console.error("Error creating test friend:", error);
            //         });
            //     };
            // });
        };
        return () => {
            unsubscribe();
        };
        
    }, [user]);

    useEffect(() => {
        console.log("Friends updated in Redux store:", friends);
    }, [friends]);

    useEffect(() => {
        console.log("MaybeFriends updated in Redux store:", maybefriends);
    }, [maybefriends]);
    
    // useEffect(() => {
    //     console.log("UserBasicInfo updated in Redux store:", userBasicInfo);
    // }, [userBasicInfo]);

    useEffect(() => {
        console.log("group updated:", grouplist);
    }, [grouplist]);


    return(
        user&& grouplist ?
            <IonPage>
                <IonHeader>
                    <IonToolbar class="ion-text-center">
                        {/* <IonButtons slot='start'>
                            <IonBackButton defaultHref='/home'></IonBackButton>
                        </IonButtons> */}
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
                    <IonItemDivider>
                        <IonLabel>グループ</IonLabel>
                    </IonItemDivider>
                    <IonList>
                        {grouplist?
                            grouplist.map((group: GroupList) =>(
                                <IonItem key={group.name} button routerLink={`/talk/talks/${group.groupid}`}>{group.name}</IonItem>
                            ))
                        :
                            <IonItem>グループがまだありません</IonItem>
                        }
                    </IonList>

                    <IonItemDivider>
                        <IonLabel>友達</IonLabel>
                    </IonItemDivider>
                    <IonList>
                        {friends?
                            friends.map((friend: Frienddoctype) =>(
                                <IonItem key={friend.uid} button routerLink={`/talk/dm/${friend.dmid}`}>
                                    <IonAvatar style={{ marginRight: "4%"}}>
                                        <img alt="User Icon is displayed here!" src={friend.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                    </IonAvatar>
                                    {friend.displayName}
                                </IonItem>
                            ))
                        :
                            <IonItem>友達がまだいません。友達を追加しよう！</IonItem>
                        }
                    </IonList>

                    <IonItemDivider>
                        <IonLabel>友達かもしれない</IonLabel>
                    </IonItemDivider>
                    <IonList>
                        {maybefriends?
                            maybefriends.map((maybefriend: Frienddoctype) =>(
                                <IonItem key={maybefriend.uid} button routerLink={`/talk/dm/${maybefriend.dmid}`}>
                                    <IonAvatar style={{ marginRight: "4%"}}>
                                        <img alt="User Icon is displayed here!" src={maybefriend.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                                    </IonAvatar>
                                    {maybefriend.displayName}
                                </IonItem>
                            ))
                        :
                            <> </>
                        }
                    </IonList>
                </IonContent>
            </IonPage>
        :
            <h1>aaaaaaaaaa</h1>
    );
};

export default List;