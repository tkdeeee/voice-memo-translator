import { add } from "ionicons/icons";
import { Frienddoctype } from "../../firebase/firestore";

export const ADD_MAYBEFRIEND = "ADD_FRIEND";
export const REMOVE_MAYBEFRIEND = "REMOVE_FRIEND";
export const FETCH_MAYBEFRIENDS = "FETCH_FRIENDS";

export const addMaybeFriend= (friend: Frienddoctype) => {
    return {
        type: ADD_MAYBEFRIEND,
        payload: friend,
    };
};

export const removeMaybeFriend= (uid: string) => {
    return {
        type: REMOVE_MAYBEFRIEND,
        payload: uid,
    };
};

export const fetchMaybeFriends = (friends: Frienddoctype[]) => {
    return {   
        type: "FETCH_MAYBEFRIENDS",
        payload: friends,
    };
};

export type FriendsAction =
    | ReturnType<typeof addMaybeFriend>
    | ReturnType<typeof removeMaybeFriend>
    | ReturnType<typeof fetchMaybeFriends>;