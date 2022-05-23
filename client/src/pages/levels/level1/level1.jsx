import { useEffect } from 'react';
import socket from '../../../socket/connection'
import '../basic/basic.css';
import './level1.css';

export default function Level1() {

    useEffect(() => {
        socket.on('login', action => {
            console.log('connected')
        })
    }, [])
    
    return(
        <game>

            <connections>
                Status: <br />
                <li id="users">0 player(s)</li>
                <ul id="list"></ul>
            </connections>

            <share>
                Seu IP<br />
                <input type="text" value="Carregando..." />
            </share>

        <div className="buttons">
            <button id="audio">
                <img src="/assets/controls/sound.png"/>
            </button>
        </div>

        <img src="/assets/sprites/mapTile.png" class="mapTile" />

        <div className="players"> </div>

        <div className="cenario"> </div>

        <credits onclick="window.open('https://github.com/drelocatelli/superMarioBrosOnline' ,'_blank')">
            Drelocatelli
        </credits>
            
        </game>
    )
}