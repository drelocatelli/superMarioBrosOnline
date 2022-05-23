import { createReducer } from "@reduxjs/toolkit"
import { changeHost } from "./hostAction"

const INITIAL_STATE = {
    host: {}
}

export default createReducer(INITIAL_STATE, {
    [changeHost.type]: (state, action) => ({
        ...state,
        host: action.payload
    })
})