const socket = io()

let connectionsEl = document.querySelector('connections')
let players = document.querySelector('.players')

// get public ip
let shareEl = document.querySelector('share').querySelector('input')

let request = new Request('https://api.ipify.org?format=json', {
    method: 'GET',
});

shareEl.onmouseenter = function (e) {
    e.target.select()
    document.execCommand('copy')
}


// player logado
socket.on('login', action => {
    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>`

    // player elements
    let player = new Array(parseInt(action.users))

    // seta player na tela

    player.push(`
    <div class="player-container" id="${action.id}" screen="0">
        <div class="scroll-spacing"></div>
            <span class="name">Player</span>
            <img src="../public/assets/sprites/mario-1.png" class="player">
    </div>
            `)

    player.forEach(player => {
        players.innerHTML += player
    })

    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")

    let newPlayerScreen = {id: socket.id, screen: 0}

    socket.emit('set_user_details', newPlayerScreen);

})

// remove player
socket.on('logout', action => {

    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>`

    let playersContainers = players.querySelectorAll('.player-container')

    playersContainers.forEach(playerContainer => {
        if (playerContainer.id == action.id) {
            playerContainer.remove()
        }
    })

    console.log(`%c Saiu do game: ${action.id}`, "background:orange; color:white;")

})

// emite o evento de tecla pressionada para
function scrollFollowsPlayer(playerElement) {
    let yourPlayerElement = Array.from(document.querySelectorAll(`div.player-container`)).map(player => {
        if (player.id === socket.id)
            return player
    })[0];
    let maxEdge = window.outerWidth - 80;
    let currentPlayerPosition = playerElement.getBoundingClientRect().left;

    if (currentPlayerPosition <= maxEdge) {
        // items that can move
        let itemsCanMove = ['.mountain', '.cenario']

        itemsCanMove.map(item => {
            let itemContent = document.querySelector(item)

            // clona o objeto sem mudar o original
            switch (itemContent.nodeName) {
                case 'IMG':
                    let currentPositionImg = parseInt(getComputedStyle(itemContent).left.match(/[0-9]{1,2000}/)[0]);
                    let newPositionImg = JSON.parse(JSON.stringify(currentPositionImg));
                    newPositionImg += 1;
                    itemContent.style.left = `-${newPositionImg}px`;
                    break;
                case 'DIV':
                    let currentPosition = parseInt(getComputedStyle(itemContent).backgroundPositionX.match(/[0-9]{1,2000}/)[0]);
                    let newPosition = JSON.parse(JSON.stringify(currentPosition));
                    newPosition += 1;
                    itemContent.style.left = `-${newPosition}px`;
                    break;
            }


        })
    } else {
        // change screen
        let newPlayerScreen = {id: socket.id}
        // evento no front
        socket.emit('change_screen', newPlayerScreen);
        // move player to start
        yourPlayerElement.style.left = '0px';

    }

}

// retorno do back
socket.on('changed_screen', (event) => {

    let yourPlayerElement = Array.from(document.querySelectorAll(`div.player-container`)).map(player => { if (player.id === socket.id) return player })[0];
    let yourCurrentScreen = event.find(player => player.id == socket.id)['screen']

    // set screen in don
    if(yourPlayerElement.hasAttribute('screen'))
        yourPlayerElement.setAttribute('screen', yourCurrentScreen)

})

function cloudsMovimentation(state) {
    let clouds = document.querySelector('.clouds-anim');

    clouds.style.animationPlayState = state;

}

document.addEventListener('keydown', (key) => {

    // disable keys scrolling
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyA", "KeyD",].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    let yourPlayerElement = Array.from(document.querySelectorAll(`div.player-container`)).map(player => {
        let scrollSpacing = player.querySelector('.scroll-spacing')
        if (player.id === socket.id)
            return scrollSpacing
    })[0];
    console.log(`%c Você pressionou uma tecla: ${socket.id}`, "background:red; color:white");

    let currentPlayerPosition = yourPlayerElement.getBoundingClientRect().left

    // movimentação das nuvens apenas quando o player estiver parado
    if (currentPlayerPosition > 1200)
        cloudsMovimentation('paused');

    cloudsMovimentation('running');

    socket.emit('keypress', { key: key.code, id: socket.id })

})

// socket.on('connected', (socket) => {
//     io.sockets.emit('change_screen', {player: socket.id, screen: '0'})
//     io.sockets.emit('login', { users, id: socket.id });
// })

socket.on('keypressed', event => {

    console.log(`%c Apertou uma tecla (${event.key}): ${event.id}`, "background:blue; color:white;")

    let playerContainer = document.querySelectorAll('.player-container')
    let pcontainer = Array.from(playerContainer)

    let uniqueContainer = pcontainer.find(x => x.id === event.id)
    let screen = uniqueContainer.getAttribute('screen')

    switch (event.key) {
        case 'Space':
        case 'KeyW':
        case 'ArrowUp':
            socket.emit('player_movement', { position: 'up', id: event.id, screen})
            break;
        case 'KeyA':
        case 'ArrowLeft':
            socket.emit('player_movement', { position: 'left', id: event.id, screen})
            break;
        case 'KeyD':
        case 'ArrowRight':
            socket.emit('player_movement', { position: 'right', id: event.id, screen })
            break;
    }

})


socket.on('player_move', (event) => {

    console.log(event)

    let playerContainer = document.querySelectorAll('.player-container')
    let pcontainer = Array.from(playerContainer)

    let uniqueContainer = pcontainer.find(x => x.id === event.id)

    if (uniqueContainer == undefined) {
        players.innerHTML += `
        <div class="player-container" id="${event.id}" screen="${event.screen}">
        <span class="name">Player</span>
        
        <img src="../public/assets/sprites/mario-1.png" class="player">
        </div>
        `
    }

    let currentPlayer = socket.id
    let currentContainer = pcontainer.find(x => x.id === currentPlayer)

    currentContainer.style.zIndex = '2'

    // character control
    const upDeslocation = 60;
    const leftDeslocation = 8;
    const floorPosition = 11;

    const verticalDeslocationTransition = `0.30s ease-out`
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
            scrollFollowsPlayer(currentContainer);
            break;
    }

    function setCharacterPositionUP() {
        uniqueContainer.style.transition = `bottom ${verticalDeslocationTransition}`;
        uniqueContainer.style.bottom = `${upDeslocation}%`
        setTimeout(() => {
            uniqueContainer.style.bottom = `${floorPosition}%`
        }, 200)
    }

    function setCharacterPositionLeft() {
        uniqueContainer.style.transition = `left ${horizontalDeslocationTransition}`;
        let currentLeft = (window.getComputedStyle(uniqueContainer).left).replace(/\D/g, "")
        let newLeft = (Number(currentLeft) - leftDeslocation)
        uniqueContainer.style.left = `${newLeft}px`;
    }

    function setCharacterPositionRight() {
        uniqueContainer.style.transition = `left ${horizontalDeslocationTransition}`;
        let currentRight = (window.getComputedStyle(uniqueContainer).left).replace(/\D/g, "")
        let newRight = (Number(currentRight) + leftDeslocation)
        uniqueContainer.style.left = `${newRight}px`;
    }

})
