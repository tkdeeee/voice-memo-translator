import { Frienddoctype } from "../../firebase/firestore";
// import { userBasicInfotype } from "../userBasicInfo/actions";

export const initialState = {
    // friends: [{uid: "a", photoURL: "b", displayName: "c"}] as Frienddoctype[],
    friends: [] as Frienddoctype[],
    maybefriends: [] as Frienddoctype[],
    blockfriends: [] as Frienddoctype[],
    // user: {
    //     uid: "",
    //     displayName: "",
    //     photoURL: "",
    //     email: "",
    // } as userBasicInfotype
};

