import { doc, setDoc, getDoc } from 'firebase/firestore' ;
import { db } from './config';
import { User } from 'firebase/auth';

type GroupList= {
  name : string,
  groupid : string
};

type Userdoctype = {
  uid: string,
  displayName: string,
  photoURL: string,
  email: string,
  group: GroupList[]
};

type Groupconfig = {
  member : string[],
  memberNumber : Number,
  name : string,
  groupid : string
};

type TalkContent = {
  speakeruid: string,
  lettercontent: string
}

type GroupTalk = {
  talkhistory: TalkContent[],
  groupconfig: Groupconfig
}

type DisplayNameandPhotoURL = {
  displayName: string,
  photoURL: string
}

type UidDisplayNameDict = {
  [uid: string]: DisplayNameandPhotoURL,
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
      typeof item.speakeruid === 'string' &&
      typeof item.lettercontent === 'string'
    )&&
    typeof data.groupconfig !== null &&
    typeof data.groupconfig === 'object' &&
    typeof data.groupconfig.member === 'object' &&
    Array.isArray(data.groupconfig.member) &&
    data.groupconfig.member.every((item: any) => typeof item === 'string') &&
    typeof data.groupconfig.memberNumber === 'number' &&
    typeof data.groupconfig.name === 'string' &&
    typeof data.groupconfig.groupid === 'string'
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
      group: [] as GroupList[],
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
async function GetSpeakerUidDict(groupid:string): Promise<UidDisplayNameDict | null> {
  const groupTalk = await GetTalkdoc(groupid);
  if (!groupTalk) {
    return null;
  }

  const speakerUidDict: UidDisplayNameDict = {};
  for(const memberUid of groupTalk.groupconfig.member) {
    const userDoc = await GetUserdoc(memberUid);
    if (userDoc) {
      speakerUidDict[memberUid] = { displayName: userDoc.displayName, photoURL: userDoc.photoURL }; // ユーザのdisplayNameとphotoURLを格納
    } else {
      speakerUidDict[memberUid] = { displayName: "Unknown User", photoURL: "https://ionicframework.com/docs/img/demos/avatar.svg"}; // ユーザが見つからない場合のデフォルト値
    }
  }
  return speakerUidDict;
}

export { CreateUserdoc, GetUserdoc, GetTalkdoc, GetSpeakerUidDict };
export type { UidDisplayNameDict, Userdoctype, TalkContent, GroupTalk, GroupList, DisplayNameandPhotoURL };