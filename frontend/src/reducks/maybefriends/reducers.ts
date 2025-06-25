import * as Actions from './actions';
import { Frienddoctype } from '../../firebase/firestore';
import { initialState } from '../store/initialState';

export const maybefriendsReducer = (state = initialState.maybefriends, action: Actions.MaybeFriendsAction): typeof initialState.maybefriends => {
    switch (action.type) {
        case Actions.ADD_MAYBEFRIEND:
            return [...state, action.payload] as Frienddoctype[]; // Ensure the state is an array of Frienddoctype
        case Actions.REMOVE_MAYBEFRIEND:
            return [...state.filter(maybefriend => maybefriend.uid !== action.payload)] as Frienddoctype[]; // Ensure the state is an array of Frienddoctype
        case Actions.FETCH_MAYBEFRIENDS:
            return action.payload as Frienddoctype[]; // Ensure the state is an array of Frienddoctype
        default:
            return state;
    }
};