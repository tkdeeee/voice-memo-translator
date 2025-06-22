import * as Actions from './actions';
import { Frienddoctype } from '../../firebase/firestore';
import { initialState } from '../store/initialState';

export const friendsReducer = (state = initialState.friends, action: Actions.FriendsAction): typeof initialState.friends => {
    switch (action.type) {
        case Actions.ADD_FRIEND:
            return [...state, action.payload] as Frienddoctype[]; // Ensure the state is an array of Frienddoctype
        case Actions.REMOVE_FRIEND:
            return [...state.filter(friend => friend.uid !== action.payload)] as Frienddoctype[]; // Ensure the state is an array of Frienddoctype
        case Actions.FETCH_FRIENDS:
            return action.payload as Frienddoctype[]; // Ensure the state is an array of Frienddoctype
        default:
            return state;
    }
};