import {
    configureStore,
    combineReducers,
}from '@reduxjs/toolkit';

import { friendsReducer } from '../friends/reducers';
import { maybefriendsReducer } from '../maybefriends/reducers';

export const store = configureStore({
    reducer: combineReducers({
        friends: friendsReducer,
        maybefriends: maybefriendsReducer, // Assuming maybefriends uses the same reducer for simplicity
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;