import { useEffect, useState, useRef, createRef } from 'react';
import { IonPage, IonHeader, IonTitle, IonContent, IonIcon, IonButton, IonImg, IonItem, IonToolbar, IonButtons, IonBackButton, IonInput, IonModal} from '@ionic/react';
import { logoGoogle, documentsOutline, pencilOutline, checkmarkOutline } from 'ionicons/icons';
import { GetUserSelfdoc } from '../firebase/firestore';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase/config';
import type { Userdoctype } from '../firebase/firestore';
import './Setting.css';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";



const Setting: React.FC = () => {
    const [displayName, setDisplayName] = useState<string|null>(null);
    const [photoURL, setPhotoURL] = useState<string|null>(null);
    const [cropURL, setCropURL] = useState<string|null>(null);
    const inputRef = useRef<HTMLIonInputElement|null>(null);
    const user = auth.currentUser;
    const [editDisplayName, setEditDisplayName] = useState<boolean>(false);
    const [editPhotoURL, setEditPhotoURL] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement|null>(null);
    const cropperRef = createRef<ReactCropperElement>();

    useEffect(() => {
        if(user?.uid){
            setDisplayName(user.displayName);
            setPhotoURL(user.photoURL);
        }
    }, []);

    const updateDisplayName = (displayName: string) => {
        if(auth.currentUser){
            updateProfile(auth.currentUser, {
                displayName: displayName, photoURL: auth.currentUser.photoURL
            }).then(() => {
                console.log("Your DisplayName was Updated!");
                setDisplayName(displayName);
            }).catch(() =>{
                console.log("CANT UPDATE YOUR DISPLAYNAME");
            })
            const UserSelfdoc = doc(db, "users", auth.currentUser.uid);
            setDoc(UserSelfdoc, {displayName: displayName}, {merge: true});
            const UserPublicdoc = doc(db, "public_profiles", auth.currentUser.uid);
            setDoc(UserPublicdoc, {displayName: displayName}, {merge: true});   
        }
    };

    const updatePhotoURL = (photoURL: string) => {
        if(auth.currentUser){
            updateProfile(auth.currentUser, {
                displayName: auth.currentUser.displayName, photoURL: photoURL
            }).then(() => {
                console.log("Your PhotoURL was Updated!");
                setPhotoURL(photoURL);
            }).catch(() =>{
                console.log("CANT UPDATE YOUR DISPLAYNAME");
            })
            const UserSelfdoc = doc(db, "users", auth.currentUser.uid);
            setDoc(UserSelfdoc, {photoURL: photoURL}, {merge: true});
            const UserPublicdoc = doc(db, "public_profiles", auth.currentUser.uid);
            setDoc(UserPublicdoc, {photoURL: photoURL}, {merge: true});
        }
    };

    const onChange = (e: any) => {
        e.preventDefault();
        console.log("onChange is called!")
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        }else if(e.target) {
            files = e.target.files;
        }
        if (!files || files.length === 0) return;
        const reader = new FileReader();
        reader.onload = () => {
            setCropURL(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
        console.log("onChange was completed!")
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            console.log("getCropData was called!");
            // setPhotoURL(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
            return cropperRef.current?.cropper.getCroppedCanvas({ width: 256, height: 256 }).toDataURL();
        }
        return null;
    };

    const dataURLtoBlob = (dataurl: string) => {
        // const arr = dataurl.split(',');
        // const mime = arr[0].match(/:(.*?);/)![1];
        // const bstr = atob(arr[1]);
        // let n = bstr.length;
        // const u8arr = new Uint8Array(n);
        // while(n--){
        //     u8arr[n] = bstr.charCodeAt(n);
        // }
        // const blob = new Blob([u8arr], {type:mime})
        // console.log(blob);
        // return blob;
        // console.log(dataurl);
        // const fileData =dataurl.replace(/^data:\w+\/\w+;base64,/, '');
        // const decodedFile = Buffer.from(fileData, 'base64')
        // const file = new File([decodedFile], `fileName.jpg`, { type: 'image/png' })
        // console.log(file);
        var bin = atob(dataurl.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        try{
            var blob = new Blob([buffer.buffer], {
                type: 'image/png'
            });
            console.log(blob);
        }catch (e){
            return false;
        }
        return blob as Blob;
    };
    

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         console.log(user);
    //     });

    //     return () => unsubscribe();
    // }, []);

    async function SignOut() {
        const auth = getAuth();
        signOut(auth).then(() =>{
            console.log("signout successful.");
        }).catch((error) =>{
            console.log("signout failed.")
        });
    };

    async function handleCopy(text: string){
        await navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch((err) => {
            console.error('Failed to copy text:', err);
        });
    };

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/list'></IonBackButton>
                    </IonButtons>
                    <IonTitle>Setting</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {user?
                    <div className="settingcontainer">
                        <IonImg class="ion-padding-top" src={photoURL ?? undefined} alt="Your Icon Is Displayed here" onClick={() => setIsModalOpen(true)} className='user-icon'></IonImg>
                        <IonItem>
                            <div className='displayName-wrapper'>
                                {editDisplayName ?
                                    <>
                                        <IonInput placeholder={displayName ?? undefined} ref={inputRef}></IonInput>
                                        <IonButton 
                                            className='white-button'
                                            onClick={() => {
                                                setEditDisplayName(false);
                                                if(inputRef.current?.value){
                                                    console.log(inputRef.current.value);
                                                    updateDisplayName(String(inputRef.current.value));
                                                }
                                            }}>
                                            <IonIcon icon={checkmarkOutline}></IonIcon>
                                        </IonButton>
                                    </>
                                :
                                    <>
                                        <p>{user.displayName}</p>
                                        <IonButton className='white-button' onClick={() => setEditDisplayName(true)}>
                                            <IonIcon icon={pencilOutline}></IonIcon>
                                        </IonButton>
                                    </>
                                }   
                            </div>
                        </IonItem>
                        <IonItem>{user.email}</IonItem>
                        
                        <IonItem style={{marginBottom: "20px"}}>
                            <p style={{paddingRight: "10px"}}>{user.uid}</p>
                            <IonButton  className='white-button' onClick={() => (user ? handleCopy(user.uid) : console.log("user is null."))}>
                                <IonIcon icon={documentsOutline}></IonIcon>
                            </IonButton>
                        </IonItem>
                        <IonButton onClick={SignOut}>Sign Out</IonButton>
                        <IonModal 
                            isOpen={isModalOpen}
                            onDidDismiss={() => setIsModalOpen(false)}
                            initialBreakpoint={0.4} 
                            breakpoints={[0, 0.4, 1]}
                            style={{width: "430px", margin: "0 auto"}}
                        >
                            <IonHeader>
                                <IonToolbar class="ion-text-center">
                                    アイコン画像を編集
                                </IonToolbar>
                            </IonHeader>
                            <IonContent>
                                <div className="setting-modal-container">
                                    {cropURL ?
                                        <Cropper
                                            ref={cropperRef}
                                            // zoomTo={0.5}
                                            className='cropper'
                                            initialAspectRatio={1}
                                            preview=".img-preview"
                                            src={cropURL}
                                            aspectRatio={1}
                                            viewMode={1}
                                            minCropBoxHeight={10}
                                            minCropBoxWidth={10}
                                            background={false}
                                            responsive={true}
                                            autoCropArea={1}
                                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                            guides={true}
                                        />
                                    :
                                        <IonImg src={photoURL ?? undefined} alt="Your Icon Is Displayed here" className='user-icon'></IonImg>
                                    }   
                                    <div className="setting-modal-button-wrapper">
                                        <IonButton onClick={() => setIsModalOpen(false)}>
                                            キャンセル    
                                        </IonButton>
                                        {cropURL ?
                                            <IonButton 
                                                onClick={async() =>{ 
                                                    const cropData = getCropData();
                                                    if(cropData){
                                                        setPhotoURL(cropData);
                                                        setIsModalOpen(false);
                                                        setCropURL(null);
                                                        const blob = dataURLtoBlob(cropData);
                                                        const storage = getStorage();
                                                        const storageRef = ref(storage, `icons/${user.uid}.png`);

                                                        if(blob){
                                                            uploadBytes(storageRef, blob).then((snapshot) => {
                                                                console.log('Uploaded a blob or file!');
                                                                // 画像のダウンロードURLを取得
                                                                getDownloadURL(snapshot.ref).then((url) => {
                                                                    console.log('File available at', url);
                                                                    updatePhotoURL(url);
                                                                }).catch((error) => {
                                                                    console.error('Error getting download URL:', error);
                                                                });
                                                            }).catch((error) => {
                                                                console.error('Upload failed:', error);
                                                            });
                                                            
                                                        };
                                                    }
                                                    }}>
                                                決定
                                            </IonButton>
                                        :                                           
                                            <IonButton onClick={() => fileInputRef.current?.click()}>
                                                編集
                                            </IonButton>
                                        }
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                            </IonContent>
                        </IonModal>
                    </div>

                :
                    <IonItem>ユーザ情報を取得できませんでした</IonItem>
                }
                
            </IonContent>
        </IonPage>
    );
};

export default Setting;