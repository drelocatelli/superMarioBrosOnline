import { useDispatch } from "react-redux";
import { SERVER } from "../../../socket/server";

export async function initialize(socket) {
    setPublicIp();

    // do login
    connect(socket)
}

async function setPublicIp() {
    const ip = await fetch(`${SERVER}/ip`)
    const input = document.querySelector('input')

    const response = await ip.json()

    input.value = response.publicIp
    // input.value = ip
}

function connect(socket) {

    socket.on('connect', () => {
        console.log('Connected')

        socket.on('login', (action) => {
            setTotalPlayers(action)
            setPlayerToScreen(action, socket)
            switchPerson()
        })

    })
}

function setTotalPlayers(action) {
    const totalPlayersEl = document.querySelector('li#users')

    totalPlayersEl.innerHTML = `${action.users} player(s)`
}

async function setPlayerToScreen(action, socket) {

    const players = document.querySelector('.players')

    // set total players array then add to screen
    let playerList = new Array(parseInt(action.users))

    const playerName = (name) => {
        return name.substr(0, 5).toUpperCase()
    }

    playerList.push(`
    <div class="player-container" id="${action.id}" screen="0" person="luigi">
        <span class="name">${playerName(action.id)}</span>
        <img src="/assets/sprites/luigi-1.png" class="player" />
    </div>
`)

    playerList.forEach(player => {
        players.innerHTML += player
    })

    setHost(action)
    
    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")


}

function setHost(action) {
    let playersContainer = document.querySelectorAll('.player-container');

    if(action.ip === '127.0.0.1') {
        let hostContainer = Array.from(playersContainer).find(player => player.id === action.id)

        // set to mario
        hostContainer.setAttribute('person', 'mario')

    }
    
}

function switchPerson() {
    let playersContainer = document.querySelectorAll('.player-container');
    playersContainer.forEach(player => {
        if(player.getAttribute('person') === 'mario') {
            player.querySelector('img').src = '/assets/sprites/mario-1.png'
        }
    })
    
}