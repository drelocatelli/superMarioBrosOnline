import { configureStore } from "@reduxjs/toolkit";
import hostReducers from "./host/hostReducers";

export const store = configureStore({
    reducer: {
        host: hostReducers,
    }
})