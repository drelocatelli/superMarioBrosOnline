import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { WEBSOCKET } from '../../../socket/server';
import { initialize } from '../basic/basic';
import {useDispatch, useSelector} from 'react-redux';
import '../basic/basic.css';
import './level1.css';
import { changePlayers } from '../../../store/player/playerAction';

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
        <div className='game'>

            <div className='connections'>
                Status: <br />
                <li id="users">0 player(s)</li>
                <ul id="list"></ul>
            </div>

            <div className='share'>
                Seu IP<br />
                <input type="text" value="Carregando..." disabled />
            </div>

        <div className="buttons">
            <button id="audio">
                <img src="/assets/controls/sound.png"/>
            </button>
        </div>

        <img src="/assets/sprites/mapTile.png" className="mapTile" />

        <div className="players"> </div>

        <div className="cenario"> </div>

        <div className='credits' onClick={() => window.open('https://github.com/drelocatelli/superMarioBrosOnline' ,'_blank')}>
            Drelocatelli
        </div>
            
        </div>
    )
}