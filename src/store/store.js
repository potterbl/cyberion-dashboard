import {combineReducers, configureStore} from "@reduxjs/toolkit";
import menuSlice from "./slices/menu.slice";
import userSlice from "./slices/user.slice";

const reducers = combineReducers({
    menu: menuSlice,
    user: userSlice
})

export const store = configureStore({
    reducer: reducers
})