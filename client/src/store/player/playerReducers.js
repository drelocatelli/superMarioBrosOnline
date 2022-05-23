import { createReducer } from "@reduxjs/toolkit"
import { changeConnected, changeHost } from "./playerAction"

const INITIAL_STATE = {
    host: {},
    players: {},
    connected: false
}

export default createReducer(INITIAL_STATE, {
    [changeConnected.type]: (state, action) => ({
        ...state,
        connected: action.payload,
    }),
    [changeHost.type]: (state, action) => ({
        ...state,
        host: action.payload,
    })
})