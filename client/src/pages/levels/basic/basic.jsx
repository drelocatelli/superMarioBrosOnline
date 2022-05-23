import { connect, setPublicIp } from "./server_connection"

export async function initialize() {

    setPublicIp();

    // do login
    connect();

}

export function CreateScene(props) {
    return(
        <game>

            <connections>
                Status: <br />
                <li id="users">0 player(s)</li>
                <ul id="list"></ul>
            </connections>

            <share>
                Seu IP<br />
                <input type="text" value="Carregando..." disabled/>
            </share>

        <div className="buttons">
            <button id="audio">
                <img src="/assets/controls/sound.png"/>
            </button>
        </div>

        {props.children}

        <credits onClick={() => window.open('https://github.com/drelocatelli/superMarioBrosOnline' ,'_blank')}>
            Drelocatelli
        </credits>
            
        </game>
    );
}