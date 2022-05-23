import { useEffect } from 'react';
import { initialize } from '../basic/basic';
import '../basic/basic.css';
import './level1.css';

export default function Level1() {
    
    useEffect(() => {
        initialize()
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