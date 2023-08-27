import { configureStore } from '@reduxjs/toolkit'
import userSlice from './states/userSlice'

export const store = configureStore({
    reducer: {
        user: userSlice
    },
})

