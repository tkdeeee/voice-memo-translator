import { Frienddoctype } from "../../firebase/firestore";

export const ADD_FRIEND = "ADD_FRIEND";
export const REMOVE_FRIEND = "REMOVE_FRIEND";
export const FETCH_FRIENDS = "FETCH_FRIENDS";

export const addFriend = (friend: Frienddoctype) => {
    return {
        type: ADD_FRIEND,
        payload: friend,
    };
};

export const removeFriend = (uid: string) => {
    return {
        type: REMOVE_FRIEND,
        payload: uid,
    };
};

export const fetchFriends = (friends: Frienddoctype[]) => {
    return {   
        type: FETCH_FRIENDS,
        payload: friends,
    };
};

export type FriendsAction =
    | ReturnType<typeof addFriend>
    | ReturnType<typeof removeFriend>
    | ReturnType<typeof fetchFriends>;