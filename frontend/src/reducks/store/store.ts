import {
    configureStore,
    combineReducers,
}from '@reduxjs/toolkit';

import { friendsReducer } from '../friends/reducers';
import { maybefriendsReducer } from '../maybefriends/reducers';
// import { userReducer } from '../userBasicInfo/reducers';

export const store = configureStore({
    reducer: combineReducers({
        friends: friendsReducer,
        maybefriends: maybefriendsReducer,
        blockfriends: friendsReducer, // Assuming blockfriends uses the same reducer as friends
        // userBasicInfo: userReducer
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;