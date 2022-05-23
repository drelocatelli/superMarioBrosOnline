import { configureStore } from "@reduxjs/toolkit";
import playerReducers from "./player/playerReducers";

export const store = configureStore({
    reducer: {
        playerReducer: playerReducers,
    }
})