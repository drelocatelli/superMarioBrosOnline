import { useEffect } from 'react';
import { initialize } from '../basic/basic';
import '../basic/basic.css';
import './scene1.css';

export default function Scene1() {
    
    useEffect(() => {
        initialize()
    }, [])
    
    return <Scene />
}

function Scene() {
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
                <img src="/assets/controls/sound.png" alt="sound icon"/>
            </button>
        </div>

        <img src="/assets/sprites/mapTile.png" className="mapTile" />

        <div className="players"> </div>

        <div className="cenario"> </div>

        <credits onClick="window.open('https://github.com/drelocatelli/superMarioBrosOnline' ,'_blank')">
            Drelocatelli
        </credits>
            
        </game>
    )
}