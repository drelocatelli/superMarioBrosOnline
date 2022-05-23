import { createReducer } from "@reduxjs/toolkit"
import { changePlayers } from "./playerAction"

const INITIAL_STATE = {
    host: {},
    players: {},
    connected: false
}

export default createReducer(INITIAL_STATE, {
    [changePlayers.type]: (state, action) => ({
        ...state,
        connected: action.payload,
    })
})