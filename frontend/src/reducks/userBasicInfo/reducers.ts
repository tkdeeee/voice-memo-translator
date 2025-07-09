// import * as Actions from './actions';
// import { userBasicInfotype } from './actions';
// import { initialState } from '../store/initialState';

// export const userReducer = (state = initialState.userBasicInfo, action: Actions.UserAction): typeof initialState.userBasicInfo => {
//     switch (action.type) {
//         case Actions.UPDATE_DISPLAYNAME:
//             return {...state, displayName: action.payload} as userBasicInfotype; 
//         case Actions.UPDATE_PHOTOURL:
//             return {...state, photoURL: action.payload} as userBasicInfotype; 
//         case Actions.FETCH_SELF_PROFILE:
//             return action.payload as userBasicInfotype;
//         default:
//             return state;
//     }
// };