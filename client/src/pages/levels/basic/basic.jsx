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
        })

    })
}

function setTotalPlayers(action) {
    const totalPlayersEl = document.querySelector('li#users')

    totalPlayersEl.innerHTML = `${action.users} player(s)`
}

function setPlayerToScreen(action, socket) {

    const players = document.querySelector('.players')

    // set total players array then add to screen
    let playerList = new Array(parseInt(action.users))

    const playerName = (name) => {
        return name.substr(0, 5).toUpperCase()
    }

    playerList.push(`
    <div className="player-container" id="${action.id}" screen="0" person="luigi">
        <span class="name">${playerName(action.id)}</span>
        <img src="/assets/sprites/luigi-1.png" class="player" />
    </div>
`)

    playerList.forEach(player => {
        players.innerHTML += player
    })

    // identifica o host
    if(action.ip === '127.0.0.1') {
        socket.emit('set_host_details', action)

        // seta host pra mario
        let hostContainer = Array.from(document.querySelectorAll('.player-container')).find(player => player.id == action.id)

        // hostContainer.querySelector('.name').innerHTML = 'HOST'
        hostContainer.querySelector('img').src = '../public/assets/sprites/mario-1.png'
        hostContainer.setAttribute('person', 'mario')
    }
    
    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")


}