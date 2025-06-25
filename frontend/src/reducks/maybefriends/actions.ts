import { add } from "ionicons/icons";
import { Frienddoctype } from "../../firebase/firestore";

export const ADD_MAYBEFRIEND = "ADD_MAYBEFRIEND";
export const REMOVE_MAYBEFRIEND = "REMOVE_MAYBEFRIEND";
export const FETCH_MAYBEFRIENDS = "FETCH_MAYBEFRIENDS";

export const addMaybeFriend= (maybefriend: Frienddoctype) => {
    return {
        type: ADD_MAYBEFRIEND,
        payload: maybefriend,
    };
};

export const removeMaybeFriend= (uid: string) => {
    return {
        type: REMOVE_MAYBEFRIEND,
        payload: uid,
    };
};

export const fetchMaybeFriends = (maybefriends: Frienddoctype[]) => {
    return {   
        type: FETCH_MAYBEFRIENDS,
        payload: maybefriends,
    };
};

export type MaybeFriendsAction =
    | ReturnType<typeof addMaybeFriend>
    | ReturnType<typeof removeMaybeFriend>
    | ReturnType<typeof fetchMaybeFriends>;