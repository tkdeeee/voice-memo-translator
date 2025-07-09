import { updateProfile } from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc } from "firebase/firestore";

export const updateDisplayName = (displayName: string) => {
    if(auth.currentUser){
        updateProfile(auth.currentUser, {
            displayName: displayName, photoURL: auth.currentUser.photoURL
        }).then(() => {
            console.log("Your DisplayName was Updated!");
        }).catch(() =>{
            console.log("CANT UPDATE YOUR DISPLAYNAME");
        })
        const UserSelfdoc = doc(db, "users", auth.currentUser.uid);
        setDoc(UserSelfdoc, {displayName: displayName}, {merge: true});
        const UserPublicdoc = doc(db, "public_profiles", auth.currentUser.uid);
        setDoc(UserPublicdoc, {displayName: displayName}, {merge: true});
    }
};

export const updatePhotoURL = (photoURL: string) => {
    if(auth.currentUser){
        updateProfile(auth.currentUser, {
            displayName: auth.currentUser.displayName, photoURL: photoURL
        }).then(() => {
            console.log("Your PhotoURL was Updated!");
        }).catch(() =>{
            console.log("CANT UPDATE YOUR DISPLAYNAME");
        })
        const UserSelfdoc = doc(db, "users", auth.currentUser.uid);
        setDoc(UserSelfdoc, {photoURL: photoURL}, {merge: true});
        const UserPublicdoc = doc(db, "public_profiles", auth.currentUser.uid);
        setDoc(UserPublicdoc, {photoURL: photoURL}, {merge: true});
    }
};