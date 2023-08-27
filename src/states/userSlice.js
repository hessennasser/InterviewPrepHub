import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
const uid = Cookies.get('user') ? JSON.parse(Cookies.get('user')).uid : null;

const initialState = {
    logged: false,
    name: "",
    email: "",
    position: "",
    token: "",
    uid: uid,
}
const userDataFromCookies = Cookies.get('user');
if (userDataFromCookies) {
    const userData = JSON.parse(userDataFromCookies)
    initialState.logged = true;
    initialState.name = userData.name;
    initialState.email = userData.email;
    initialState.position = userData.position;
    initialState.token = userData.token;
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            const { name, email, position, token, uid } = action.payload;
            console.log(uid);
            state.logged = true;
            state.name = name;
            state.email = email;
            state.position = position;
            state.token = token;
            state.uid = uid;
            toast.success("Your account login successfully")
        },
        logout: (state) => {
            // Clear user data from cookies
            Cookies.remove('user');
            localStorage.removeItem("logged")
            toast.success("Your account logout successfully")
            // Reset state
            state.logged = false;
            state.name = "";
            state.email = "";
            state.position = "";
            state.token = "";
            state.uid = "";
        },
        updateUser: (state, action) => {
            const { username, email } = action.payload;
            state.name = username;
            state.email = email;
        },
    }
})

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
