import { store } from "../../../store/storeConfig";
import {changeConnected, changeHost} from '../../../store/player/playerAction'
import { SERVER } from "../../../socket/server";

export async function initialize(socket) {
    setPublicIp();

    // do login
    connect(socket)

    // key activation && movimentation
    keyHandle(socket)
}

function keyHandle(socket) {
    document.addEventListener('keydown', (key) => {
        disableKeyScrolling()

        // your player element
        let yourPlayerElement = Array.from(document.querySelectorAll('.player-container')).find(player => player.id === socket.id)
        let currentPlayerPosition = yourPlayerElement.getBoundingClientRect().left
        
        socket.emit('keypress', {key: key.code, id: socket.id})
        
        // movePlayer(socket)
        
    })
}

function movePlayer(socket) {

    socket.on('player_move', (event) => {
        console.log(`%c Apertou uma tecla (${event.key}): ${event.id}`, "background:blue; color:white;")

        
    })
    
}

function disableKeyScrolling() {
    // disable keys scrolling
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyA", "KeyD",].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
}

async function setPublicIp() {
    const input = document.querySelector('input')

    const ip = await fetch(`${SERVER()}/ip`)
    const port = new URL(window.location.href).port

    const response = await ip.json()

    input.value = `${response.publicIp}:${port}`

}

function connect(socket) {

    socket.on('connect', (e) => {
        socket.on('login', (action) => {
            setTotalPlayers(action)
            setPlayerToScreen(action, socket)
            switchCharacter(socket)
        })
    })

    socket.on('player_move', action => {
        console.log(action)
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

    setHost(action, socket)
    
    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")


}

function setHost(action, socket) {
    
    let playersContainer = document.querySelectorAll('.player-container');

    if(action.ip === '127.0.0.1') {
        let hostContainer = Array.from(playersContainer).find(player => player.id === action.id)

        // set to mario
        hostContainer.setAttribute('person', 'mario')

        socket.emit('set_host_details', {hostId: action.id, ip: action.ip})

        store.dispatch(changeConnected(true))
        store.dispatch(changeHost({hostId: action.id, ip: action.ip}))

    } else {
        let otherPlayers = Array.from(playersContainer).find(player => player.id == action.id)

        socket.emit('set_user_details', {id: socket.id})
    }
    
}

function switchCharacter(socket) {
    
    socket.on("host_setted", action => {
        let playersContainer = document.querySelectorAll('.player-container');
        playersContainer.forEach(player => {
            if(player.getAttribute('person') === 'mario') {
                player.querySelector('img').src = '/assets/sprites/mario-1.png'
            }
        })
    })
    
}