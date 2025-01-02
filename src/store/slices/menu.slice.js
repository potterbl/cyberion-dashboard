import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        changeOpenMenu: (state) => {
            state.isOpen = !state.isOpen;
        }
    }
})

export const {changeOpenMenu} = menuSlice.actions;

export default menuSlice.reducer;