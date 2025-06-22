import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
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
  group: GroupList[],
  friends: Frienddoctype[],
  maybefriends: Frienddoctype[] // オプションプロパティとしてmaybefriendsを追加
};

type Frienddoctype = {
  displayName: string,
  photoURL: string,
  uid: string,
  dmid?: string // オプションプロパティとしてdmURLを追加
}

type Groupconfig = {
  member : string[],
  name : string,
};

type TalkContent = {
  speakeruid: string,
  lettercontent: string
}

type GroupTalk = {
  talkhistory: TalkContent[],
  groupconfig: Groupconfig
}

type Dm = {
  member: string[],
  memberdict: {[uid: string]: string }, 
  talkhistory: TalkContent[]
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
    Array.isArray(data.group) &&
    data.group.every((item: any) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.name === 'string' &&
      typeof item.groupid === 'string'
    ) &&
    Array.isArray(data.friends) &&
    data.friends.every((item: any) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.displayName === 'string' &&
      typeof item.photoURL === 'string' &&
      typeof item.uid === 'string'
    )
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
    Array.isArray(data.groupconfig.member) &&
    data.groupconfig.member.every((item: any) => typeof item === 'string') &&
    typeof data.groupconfig.name === 'string'
  ); 
}

//DM型ガード関数
function isDMdoctype(data: any): data is Dm{
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
    typeof data.member !== null &&
    typeof data.member === 'object' &&
    Array.isArray(data.member) &&
    data.member.every((item: any) => typeof item === 'string')&&
    typeof data.memberdict !== null &&
    typeof data.memberdict === 'object' &&  
    Object.values(data.memberdict).every((value: any) => 
      Array.isArray(value) && value.every((item: any) => typeof item === 'string')
    ) &&
    Object.keys(data.memberdict).every((key: string) => typeof key === 'string')
  );
}


//authenticationにユーザがいなければfirestoreに新しくユーザデータベースを作成
async function CreateUserdoc(user: Userdoctype): Promise<void>{
  const userDoc = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDoc);
  // console.log(docSnap.data());
  if(!docSnap.data()){
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      group: [] as GroupList[],
      friends: [] as Frienddoctype[],
      maybefriends: [] as Frienddoctype[] // maybefriendsを初期化
      // group: user.group,
      // friends: user.friends
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

//新規友達追加orキャンセル選択時に使用、firestoreのusersからuidに紐づく友達情報を取得、(in)uid:string/(out)docsnap:Frienddoctype
async function GetFrienddoc(uid:string) : Promise<Frienddoctype|null>{
  const userDoc = doc(db, "users", uid);
  const docSnap = (await getDoc(userDoc)).data();
  if (docSnap && typeof docSnap.displayName === 'string' && typeof docSnap.photoURL === 'string' && typeof docSnap.uid === 'string') {
    return {
      displayName: docSnap.displayName,
      photoURL: docSnap.photoURL,
      uid: docSnap.uid
    } as Frienddoctype;
  }
  return null;
}

//新規友達の追加を選択後に使用、firestoreのdmに新しいドキュメントを作成、(in)uid:string, friend:Frienddoctype/(out)docsnap:string
async function CreateDMdoc(uid: string, friend: Frienddoctype): Promise<string> {
  const res = await addDoc(collection(db, "dm"), {
    member: [uid, friend.uid],
    memberdict: {
      [uid]: [friend.uid],
      [friend.uid]: [uid]
    },
    talkhistory: [],
  });
  console.log("DM document created with ID:", res.id);
  return res.id; // 作成したドキュメントのIDを返す
}

//新規友達の追加を選択後に使用、firestoreのusersに新しいドキュメントを作成、(in)uid:string, friend:Frienddoctype/(out)docsnap:void
async function UpdateFrienddoc(uid: string, friend: Frienddoctype): Promise<void> {
  // ユーザドキュメントを取得
  const userDoc = doc(db, "users", uid);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const userData = docSnap.data() as Userdoctype;
    // 友達リストに追加
    const updatedFriends = [...userData.friends, friend];
    await setDoc(userDoc, { ...userData, friends: updatedFriends });
  } else {
    console.error("User document does not exist.");
  }
}

//新規友達の追加を選択後に使用、firestoreのusersに新しいドキュメントを作成、(in)uid:string, maybefriend:Frienddoctype/(out)docsnap:void
async function UpdateMaybeFrienddoc(uid: string, maybefriend: Frienddoctype): Promise<void> {
  // ユーザドキュメントを取得
  const userDoc = doc(db, "users", uid);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const userData = docSnap.data() as Userdoctype;
    // 友達リストに追加
    const updatedFriends = [...userData.maybefriends, maybefriend];
    await setDoc(userDoc, { ...userData, maybefriends: updatedFriends });
  } else {
    console.error("User document does not exist.");
  }
}

//firestoreのtalk（グループトークを管理するコレクション）からgroupidのトーク履歴、グループ情報を取得、(in)groupid:srting/(out)docsnap:GroupTalk
async function GetTalkdoc(groupid:string) : Promise<GroupTalk|null>{
  const GroupTalkdoc = doc(db, "talks", groupid);
  const docSnap = (await getDoc(GroupTalkdoc)).data();
  if(isGroupTalkdoctype(docSnap)){
    return docSnap as GroupTalk;
  }
  return null;
}

//firestoreのdm（DMを管理するコレクション）からdmidのトーク履歴、グループ情報を取得、(in)dmid:srting/(out)docsnap:GroupTalk
async function GetDmdoc(dmid:string) : Promise<Dm|null>{
  const GroupDMdoc = doc(db, "dm", dmid);
  const docSnap = (await getDoc(GroupDMdoc)).data();
  if(isDMdoctype(docSnap)){
    return docSnap as Dm;
  }
  return null;
}

//firestoreのtalksのあるグループのmemberのuid一つ一つをusers内のそれぞれのユーザのdisplaynameと紐づける
async function GetSpeakerUidDict(groupmember:string[]): Promise<UidDisplayNameDict | null> {
  const speakerUidDict: UidDisplayNameDict = {};
  for(const memberUid of groupmember) {
    const userDoc = await GetUserdoc(memberUid);
    if (userDoc) {
      speakerUidDict[memberUid] = { displayName: userDoc.displayName, photoURL: userDoc.photoURL }; // ユーザのdisplayNameとphotoURLを格納
    } else {
      speakerUidDict[memberUid] = { displayName: "Unknown User", photoURL: "https://ionicframework.com/docs/img/demos/avatar.svg"}; // ユーザが見つからない場合のデフォルト値
    }
  }
  return speakerUidDict;
}

export { CreateUserdoc, GetUserdoc, GetTalkdoc, GetSpeakerUidDict, GetFrienddoc, CreateDMdoc, UpdateFrienddoc, UpdateMaybeFrienddoc, GetDmdoc };
export type { UidDisplayNameDict, Userdoctype, TalkContent, GroupTalk, Dm, GroupList, DisplayNameandPhotoURL, Frienddoctype, Groupconfig };