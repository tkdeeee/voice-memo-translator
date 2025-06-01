import { doc, setDoc, getDoc } from 'firebase/firestore' ;
import { db } from './config';
import { User } from 'firebase/auth';

type Group = {
  member : string[],
  membernumber : Number
};

type Userdoctype = {
  uid: string,
  displayName: string,
  photoURL: string,
  email: string,
  group: Group[]
};

async function CreateUserdoc(uid:string, photoURL:string, displayName: string, email: string) {
    const userDoc = doc(db, "users", uid);
    const docSnap = await getDoc(userDoc);
    console.log(docSnap.data());
    if(!docSnap.data()){
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        displayName: displayName,
        photoURL: photoURL,
        email: email,
        group: [] as Group[],
      });
    };
  };

function isUserdoctype(data: any): data is Userdoctype{
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.uid === 'string' &&
    typeof data.displayName === 'string' &&
    typeof data.photoURL === 'string' &&
    typeof data.email === 'string' &&
    Array.isArray(data.group)
  );
}

async function GetUserdoc(uid:string) : Promise<Userdoctype|null>{
  const userDoc = doc(db, "users", uid);
  const docSnap = (await getDoc(userDoc)).data();
  if (isUserdoctype(docSnap)){
    return docSnap as Userdoctype;
  }
  return  null;
}

export { CreateUserdoc, GetUserdoc };
export type { Group, Userdoctype };