export default function Game({children}) {
    return (
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
                    <img src="/assets/controls/sound.png" />
                </button>
            </div>

            <img src="/assets/sprites/mapTile.png" className="mapTile" />

            <div className="players"> </div>

            <div className="cenario"> </div>

            {children}

            <div className='credits' onClick={() => window.open('https://github.com/drelocatelli/superMarioBrosOnline', '_blank')}>
                Drelocatelli
            </div>

        </div>
    );
}