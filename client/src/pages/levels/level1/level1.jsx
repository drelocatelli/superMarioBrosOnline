import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { WEBSOCKET } from '../../../socket/server';
import { initialize } from '../basic/basic';
import {useDispatch, useSelector} from 'react-redux';
import '../basic/basic.css';
import './level1.css';
import { changePlayers } from '../../../store/player/playerAction';
import Game from '../basic/basicWidgets';

export default function Level1() {

    const playerReducer = useSelector(state => state.playerReducer)

    useEffect(() => {
        const socket = io(WEBSOCKET)

        initialize(socket)

    }, [])
    
    return <Scene />
}

function Scene() {
    return(
        <Game>
        </Game>
    )
}