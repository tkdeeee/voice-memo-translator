import { Frienddoctype } from "../../firebase/firestore";

export const ADD_BLOCK_FRIEND = "ADD_BLOCK_FRIEND";
export const REMOVE_BLOCK_FRIEND = "REMOVE_BLOCK_FRIEND";
export const FETCH_BLOCK_FRIENDS = "FETCH_BLOCK_FRIENDS";

export const addBlockFriend = (friend: Frienddoctype) => {
    return {
        type: ADD_BLOCK_FRIEND,
        payload: friend,
    };
};

export const removeBlockFriend= (uid: string) => {
    return {
        type: REMOVE_BLOCK_FRIEND,
        payload: uid,
    };
};

export const fetchBlockFriends = (friends: Frienddoctype[]) => {
    return {   
        type: FETCH_BLOCK_FRIENDS,
        payload: friends,
    };
};

export type BlockFriendsAction =
    | ReturnType<typeof addBlockFriend>
    | ReturnType<typeof removeBlockFriend>
    | ReturnType<typeof fetchBlockFriends>;