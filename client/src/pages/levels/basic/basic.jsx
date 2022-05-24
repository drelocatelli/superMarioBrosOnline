import { store } from "../../../store/storeConfig";
import { changeConnected, changeHost } from '../../../store/player/playerAction'
import { SERVER } from "../../../socket/server";

export async function initialize(socket) {
    setPublicIp();

    // do login
    connect(socket)

    // movimentation
    activateKeys(socket)
}

function activateKeys(socket) {
    document.addEventListener('keydown', (key) => {
        disableKeyScrolling()

        // your player element
        let yourPlayerElement = Array.from(document.querySelectorAll('.player-container')).find(player => player.id === socket.id)
        let currentPlayerPosition = yourPlayerElement.getBoundingClientRect().left

        switch (key.key) {
            case 'Space':
            case 'KeyW':
            case 'ArrowUp':
                socket.emit('keypress', { key: key.code, id: socket.id, position: 'up' })
                break;
            case 'KeyA':
            case 'ArrowLeft':
                socket.emit('keypress', { key: key.code, id: socket.id, position: 'left' })
                break;
            case 'KeyD':
            case 'ArrowRight':
                socket.emit('keypress', { key: key.code, id: socket.id, position: 'right' })
                break;
        }

        

        movePlayer(socket)

    })
}

function movePlayer(socket) {

    socket.on('player_move', (event) => {
        console.log(`%c Apertou uma tecla (${event.key}): ${event.id}`, "background:blue; color:white;")

        let playerContainer = document.querySelectorAll('.player-container')
        let pcontainer = Array.from(playerContainer)

        let currentContainer = pcontainer.find(player => player.id === event.id)
        let uniqueContainer = currentContainer

        // set player on front of all players
        currentContainer.style.zIndex = '2'

        // character control
        const upDeslocation = 60;
        const leftDeslocation = 3;
        const floorPosition = 11;

        const verticalDeslocationTransition = `0.3s ease-out`
        const horizontalDeslocationTransition = `0.30ms`

        switch (event.position) {
            case 'up':
                setCharacterPositionUP()
                break;
            case 'left':
                setCharacterPositionLeft()
                break;
            case 'right':
                setCharacterPositionRight()
                // scrollFollowsHost(currentContainer, event);
                break;
        }

        // animation of jump
        function setAnimationJump(side, person, container) {
            switch (side) {
                case 'left':
                    container.querySelector('img').src = `/assets/sprites/${person}-1-jump-1-invert.png`;
                    break;
                case 'right':
                    container.querySelector('img').src = `/assets/sprites/${person}-1-jump-1.png`;
                    break;
            }
        }

        // animation of walk
        function setAnimationSide(side, person, container) {
            switch (side) {
                case 'left':
                    container.querySelector('img').src = `/assets/sprites/${person}-1-run-1-invert.png`;
                    setTimeout(() => {
                        // go back to normal 
                        container.querySelector('img').src = `/assets/sprites/${person}-1-invert.png`;
                    }, 100)
                    break;
                case 'right':
                    container.querySelector('img').src = `/assets/sprites/${person}-1-run-1.png`;
                    setTimeout(() => {
                        // go back to normal 
                        container.querySelector('img').src = `/assets/sprites/${person}-1.png`;
                    }, 100)
                    break;
            }
        }

        function setCharacterPositionUP() {
            let person = uniqueContainer.getAttribute('person')
            let currentUp = uniqueContainer.style.bottom.match(/[0-9]*/)[0]

            // evita salto duplo
            if (currentUp > floorPosition && currentUp <= upDeslocation) return;

            setAnimationJump('right', person, uniqueContainer)
            uniqueContainer.style.transition = `bottom ${verticalDeslocationTransition}`;
            uniqueContainer.style.bottom = `${upDeslocation}%`
            setTimeout(() => {
                uniqueContainer.style.bottom = `${floorPosition}%`
                setAnimationSide('right', person, uniqueContainer)
            }, 200)

        }

        function setCharacterPositionLeft() {
            let person = uniqueContainer.getAttribute('person')
            setAnimationSide('left', person, uniqueContainer)
            uniqueContainer.style.transition = `left ${horizontalDeslocationTransition}`;
            let currentLeft = (window.getComputedStyle(uniqueContainer).left).replace(/\D/g, "")
            let newLeft = (Number(currentLeft) - leftDeslocation)
            uniqueContainer.style.left = `${newLeft}px`;

        }

        function setCharacterPositionRight() {
            let person = uniqueContainer.getAttribute('person')
            setAnimationSide('right', person, uniqueContainer)
            uniqueContainer.style.transition = `left ${horizontalDeslocationTransition}`;
            let currentRight = (window.getComputedStyle(uniqueContainer).left).replace(/\D/g, "")
            let newRight = (Number(currentRight) + leftDeslocation)
            uniqueContainer.style.left = `${newRight}px`;
        }


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
        socket.on('logout', (action) => {
            removePlayer(action)
        })
    })

}

function removePlayer(action) {
    const playerContainer = Array.from(document.querySelectorAll('.player-container')).find(player => player.id === action.id)
    playerContainer.remove()
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

    if (action.ip === '127.0.0.1') {
        let hostContainer = Array.from(playersContainer).find(player => player.id === action.id)

        // set to mario
        hostContainer.setAttribute('person', 'mario')

        socket.emit('set_host_details', { hostId: action.id, ip: action.ip })

        store.dispatch(changeConnected(true))
        store.dispatch(changeHost({ hostId: action.id, ip: action.ip }))

    } else {
        let otherPlayers = Array.from(playersContainer).find(player => player.id == action.id)

        socket.emit('set_user_details', { id: socket.id })
    }

}

function switchCharacter(socket) {

    socket.on("host_setted", action => {
        let playersContainer = document.querySelectorAll('.player-container');
        playersContainer.forEach(player => {
            if (player.getAttribute('person') === 'mario') {
                player.querySelector('img').src = '/assets/sprites/mario-1.png'
            }
        })
    })

}