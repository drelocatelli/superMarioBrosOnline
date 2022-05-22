const socket = io()

let connectionsEl = document.querySelector('connections')
let players = document.querySelector('.players')

var host = {}

const spritesFolder = '../public/assets/sprites/'

socket.on('host_setted', (event) => {
    // set host on front
    host = event
})

const playerName = (name) => {
    return name.substr(0, 5).toUpperCase()
}

// player logado
socket.on('login', action => {
    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>`

    // player elements
    let player = new Array(parseInt(action.users))

    // seta player na tela

    player.push(`
    <div class="player-container" id="${action.id}" screen="0" person="luigi">
        <div class="scroll-spacing"></div>
            <span class="name">${playerName(action.id)}</span>
            <img src="${spritesFolder}/luigi-1.png" class="player">
    </div>
            `)

    player.forEach(player => {
        players.innerHTML += player
    })

    // identifica o host
    if(action.ip === '127.0.0.1') {
        host = action
        socket.emit('set_host_details', action)

        // seta host pra mario
        let hostContainer = Array.from(document.querySelectorAll('.player-container')).find(player => player.id == action.id)

        // hostContainer.querySelector('.name').innerHTML = 'HOST'
        hostContainer.querySelector('img').src = '../public/assets/sprites/mario-1.png'
        hostContainer.setAttribute('person', 'mario')
    }
    
    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")

    let newPlayerScreen = { id: socket.id, screen: 0 }

    socket.emit('set_user_details', newPlayerScreen);

    setScreenVisibility();

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

function scrollFollowsHost(playerElement, mouseEvent) {

    let hostElement = Array.from(document.querySelectorAll(`div.player-container`)).find(player => player.id == mouseEvent.hostId);
    let othersPlayersElements = Array.from(document.querySelectorAll(`div.player-container`)).filter(player => player.id != mouseEvent.hostId)

    let maxEdge = document.querySelector('.maxEdge').getBoundingClientRect().left;
    let HostPosition = hostElement.querySelector('img').getBoundingClientRect().left;

    const imgDeslocation = 1.5;


    // set max edge for you, basic player 
    if(mouseEvent.hostId !== mouseEvent.id) {
        let yourPlayerElement = othersPlayersElements.find(player => player.id == mouseEvent.id)
        let yourPosition = yourPlayerElement.querySelector('img').getBoundingClientRect().left;
        if(yourPosition > maxEdge) {
            yourPlayerElement.style.left = '0px'
        }
    }
    
    // quando o host se mexer
    if(mouseEvent.hostId === mouseEvent.id)
    if (HostPosition < maxEdge) {
        // items that can move
        let itemsCanMove = ['.mapTile', '.cenario']

        itemsCanMove.map(item => {
            let itemContent = document.querySelector(item)

            // clona o objeto sem mudar o original
            switch (itemContent.nodeName) {
                case 'IMG':
                    let currentPositionImg = parseInt(getComputedStyle(itemContent).left.match(/[0-9]{1,2000}/)[0]);
                    let newPositionImg = JSON.parse(JSON.stringify(currentPositionImg));
                    newPositionImg += imgDeslocation;
                    itemContent.style.left = `-${newPositionImg}px`;
                    break;
                case 'DIV':
                    let currentPosition = parseInt(getComputedStyle(itemContent).backgroundPositionX.match(/[0-9]{1,2000}/)[0]);
                    let newPosition = JSON.parse(JSON.stringify(currentPosition));
                    newPosition += imgDeslocation;
                    itemContent.style.left = `-${newPosition}px`;
                    break;
            }


        })
    } else {
        // change screen
        let newPlayerScreen = { id: socket.id }
        // evento no front
        socket.emit('change_screen', {hostId: mouseEvent.hostId});
        // move all players to start
        // othersPlayersElements.forEach(otherPlayer => {
        //     otherPlayer.style.left = '0px'
        // })
        // hostElement.style.left = '0px';

    }

}

// retorno do back
socket.on('changed_screen', (event) => {

    console.log('screen changed')

    let hostElement = Array.from(document.querySelectorAll(`div.player-container`)).find(player => player.id == event.hostId);
    let othersPlayersElements = Array.from(document.querySelectorAll(`div.player-container`)).filter(player => player.id != event.hostId)

    // when screen changed, set players to start
    othersPlayersElements.forEach(otherPlayer => {
        otherPlayer.style.left = '0px'
    })
    hostElement.style.left = '0px';

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
    // console.log(`%c Você pressionou uma tecla: ${socket.id}`, "background:red; color:white");

    let currentPlayerPosition = yourPlayerElement.getBoundingClientRect().left

    // movimentação das nuvens apenas quando o player estiver parado
    if (currentPlayerPosition > 1200)
        cloudsMovimentation('paused');

    cloudsMovimentation('running');

    socket.emit('keypress', { key: key.code, id: socket.id, shiftKey: key.shiftKey })

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
            socket.emit('player_movement', { position: 'up', shiftKey: event.shiftKey, id: event.id, screen })
            break;
        case 'KeyA':
        case 'ArrowLeft':
            socket.emit('player_movement', { position: 'left', shiftKey: event.shiftKey, id: event.id, screen })
            break;
        case 'KeyD':
        case 'ArrowRight':
            socket.emit('player_movement', { position: 'right', shiftKey: event.shiftKey, id: event.id, screen })
            break;
    }

})


socket.on('player_move', (event) => {

    // set host to mario
    if(event.hostId == event.id) {
        let hostContainer = Array.from(document.querySelectorAll('.player-container')).find(player => player.id === event.hostId)
        if(typeof hostContainer != 'undefined') hostContainer.setAttribute('person', 'mario')
    }


    let playerContainer = document.querySelectorAll('.player-container')
    let pcontainer = Array.from(playerContainer)

    let uniqueContainer = pcontainer.find(x => x.id === event.id)

    if (uniqueContainer == undefined) {
        players.innerHTML += `
        <div class="player-container" id="${event.id}" screen="${event.screen}">
        <span class="name">${playerName(event.id)}</span>
        
        <img src="${spritesFolder}/mario-1.png" class="player">
        </div>
        `
    }

    let currentPlayer = socket.id
    let currentContainer = pcontainer.find(x => x.id === currentPlayer)

    currentContainer.style.zIndex = '2'

    // character control
    const upDeslocation = 80;
    const leftDeslocation = 5;
    const floorPosition = 11;

    const verticalDeslocationTransition = `0.3s ease-out`
    const horizontalDeslocationTransition = `0.30ms`

    if (event.shiftKey) { 
        // salto e lado
        switch (event.position) {
            case 'left':
                setCharacterPositionUPShift('left')
                break;
            case 'right':
                setCharacterPositionUPShift('right')
                scrollFollowsHost(currentContaine, event);
                break;
        }
    } else {

        switch (event.position) {
            case 'up':
                setCharacterPositionUP()
                break;
            case 'left':
                setCharacterPositionLeft()
                break;
            case 'right':
                setCharacterPositionRight()
                scrollFollowsHost(currentContainer, event);
                break;
        }
    }

    

    // pula para cima e anda
    function setCharacterPositionUPShift(position) {

        // uniqueContainer.style.transition = `left ${horizontalDeslocationTransition}`;
        // let currentLeft = (window.getComputedStyle(uniqueContainer).left).replace(/\D/g, "")
        // let newLeft = (Number(currentLeft) - leftDeslocation)
        // uniqueContainer.style.left = `${newLeft}px`;

        // let currentUp = uniqueContainer.style.bottom.match(/[0-9]*/)[0]

        // // pula
        // if (currentUp > floorPosition && currentUp <= upDeslocation) return;

        // uniqueContainer.style.transition = `bottom ${verticalDeslocationTransition}`;
        // uniqueContainer.style.bottom = `${upDeslocation}%`
        // setTimeout(() => {
        //     uniqueContainer.style.bottom = `${floorPosition}%`
        // }, 200)


        // if(position === 'left') {
        //     setCharacterPositionLeft()

        // } else if(position === 'right') {
        //     setCharacterPositionRight()
        // }

    }

    // animation of jump
    function setAnimationJump(side, person, container) {
        switch(side) {
            case 'left':
                container.querySelector('img').src = `${spritesFolder}/${person}-1-jump-1-invert.png`;
            break;
            case 'right':
                container.querySelector('img').src = `${spritesFolder}/${person}-1-jump-1.png`;
            break;
        }
    }

    // animation of walk
    function setAnimationSide(side, person, container) {
        switch(side) {
            case 'left':
                container.querySelector('img').src = `${spritesFolder}/${person}-1-run-1-invert.png`;
                setTimeout(() => {
                    // go back to normal 
                    container.querySelector('img').src = `${spritesFolder}/${person}-1-invert.png`;
                }, 100)
            break;
            case 'right':
                container.querySelector('img').src = `${spritesFolder}/${person}-1-run-1.png`;
                setTimeout(() => {
                    // go back to normal 
                    container.querySelector('img').src = `${spritesFolder}/${person}-1.png`;
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

var setScreenVisibility = () => {

    let yourPlayerElement = Array.from(document.querySelectorAll(`div.player-container`)).find(player => player.id === socket.id);
    let othersPlayerElements = Array.from(document.querySelectorAll(`div.player-container`)).filter(player => player.id != socket.id)

    let yourPlayerScreen = parseInt(yourPlayerElement.getAttribute('screen'));

    othersPlayerElements.forEach(otherPlayer => {
        let otherPlayerScreen = parseInt(otherPlayer.getAttribute('screen'))

        // se você estiver na frente
        if (yourPlayerScreen > otherPlayerScreen) {
            otherPlayer.style.opacity = '0.25'
            setTimeout(() => {
                otherPlayer.style.opacity = '1'
            }, 300)
        } else if (yourPlayerScreen < otherPlayerScreen) {
            // se voce estiver atras
            otherPlayer.style.opacity = '0.25'
            setTimeout(() => {
                otherPlayer.style.opacity = '1'
            }, 300)
        } else if (yourPlayerScreen == otherPlayerScreen) {
            // screens iguais
            otherPlayer.style.opacity = '1'
        }

    })

}