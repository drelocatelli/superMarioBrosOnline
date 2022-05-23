import { SERVER, socket } from "../../../socket/connection"

export async function setPublicIp() {
    const ip = await fetch(`${SERVER}/ip`)
    const input = document.querySelector('input')

    const response = await ip.json()

    input.value = response.publicIp
    // input.value = ip
}

export async function connect() {
    const connectionsBar = document.querySelector('connections')

    socket.on('login', action => {
        console.log('Connected at server')

        // set total players online
        connectionsBar.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>`

        // set players on screen
        setPlayerOnScreen(action)
    })
}

function setPlayerOnScreen(action) {
    const players = document.querySelector('.players')

    // player elements
    let player = new Array(parseInt(action.users))

    // resume name
    const playerName = (name) => {
        return name.substr(0, 5).toUpperCase()
    }

    player.push(`
    <div class="player-container" id="${action.id}" screen="0" person="luigi">
        <div class="scroll-spacing"></div>
            <span class="name">${playerName(action.id)}</span>
            <img src="/assets/sprites/luigi-1.png" class="player">
    </div>
            `)

    player.forEach(player => {
        players.innerHTML += player
    })

    // set host as mario
    setHostPlayerAsMario(action)
    
}

function setHostPlayerAsMario(action) {
    // identifica o host
    if(action.ip === '127.0.0.1') {
        socket.emit('set_host_details', action)

        // seta host pra mario
        let hostContainer = Array.from(document.querySelectorAll('.player-container')).find(player => player.id == action.id)

        // hostContainer.querySelector('.name').innerHTML = 'HOST'
        hostContainer.querySelector('img').src = '/assets/sprites/mario-1.png'
        hostContainer.setAttribute('person', 'mario')
    }
    
    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")

    let newPlayerScreen = { id: socket.id, screen: 0 }

    socket.emit('set_user_details', newPlayerScreen);
}
