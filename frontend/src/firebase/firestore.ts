import { doc, setDoc, getDoc } from 'firebase/firestore' ;
import { db } from './config';
import { User } from 'firebase/auth';

type Group = {
  member : string[],
  membernumber : Number,
  name : string,
  groupid : string
};

type Userdoctype = {
  uid: string,
  displayName: string,
  photoURL: string,
  email: string,
  group: Group[]
};

type TalkContent = {
  uid: string,
  lettercontent: string
}

type GroupTalk = {
  talkhistory: TalkContent[],
  name: string
}



//Userdoctype型ガード関数
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

//GroupTalk型ガード関数
function isGroupTalkdoctype(data: any): data is GroupTalk{
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.talkhistory) &&
    data.talkhistory.every((item: any) => 
      typeof item === 'object' &&
      item !== null &&
      typeof item.uid === 'string' &&
      typeof item.lettercontent === 'string'
    )&&
    typeof data.name === 'string'
  );
}

//authenticationにユーザがいなければfirestoreに新しくユーザデータベースを作成
async function CreateUserdoc(uid:string, photoURL:string, displayName: string, email: string) {
  const userDoc = doc(db, "users", uid);
  const docSnap = await getDoc(userDoc);
  // console.log(docSnap.data());
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

//firestoreのユーザDBからユーザ情報を取得、(in)uid:sring/ (out)docsnap:Userdoctype
async function GetUserdoc(uid:string) : Promise<Userdoctype|null>{
  const userDoc = doc(db, "users", uid);
  const docSnap = (await getDoc(userDoc)).data();
  if (isUserdoctype(docSnap)){
    return docSnap as Userdoctype;
  }
  return  null;
}


//firestoreのtalkからgroupidのトーク履歴、グループ情報を取得、(in)groupid:srting/(out)docsnap:GroupTalk
async function GetTalkdoc(groupid:string) : Promise<GroupTalk|null>{
  const GroupTalkdoc = doc(db, "talks", groupid);
  const docSnap = (await getDoc(GroupTalkdoc)).data();
  if(isGroupTalkdoctype(docSnap)){
    return docSnap as GroupTalk;
  }
  return null;
}

//firestoreのtalksのあるグループのmemberのuid一つ一つをusers内のそれぞれのユーザのdisplaynameと紐づける
async function GetSpeakerUidDict(groupid:stiring): Promise<

export { CreateUserdoc, GetUserdoc, GetTalkdoc };
export type { Group, Userdoctype, TalkContent, GroupTalk };