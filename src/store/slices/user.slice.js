import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: "",
    type: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const {name, type} = action.payload
            state.name = name
            state.type = type
        }
    }
})

export const {setUser} = userSlice.actions;
export default userSlice.reducer;