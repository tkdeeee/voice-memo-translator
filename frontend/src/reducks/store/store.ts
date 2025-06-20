import {
    configureStore,
    combineReducers,
}from '@reduxjs/toolkit';

import { friendsReducer } from '../friends/reducers';

export const store = configureStore({
    reducer: combineReducers({
        friends: friendsReducer,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;