const socket = io()

let connectionsEl = document.querySelector('connections')

let players = document.querySelector('.players') 

let character = [
    "Mario",
    "Luigi",
]

// player logado
socket.on('login', action =>{
    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>` 

    // player elements
    let player = new Array(parseInt(action.users))

    // seta player na tela

    for(let i = 0; i < parseInt(action.users); i++){
        player[i] = `<div class="player-container" id="${action.id}">
                 <span class="name">Player ${i+1}</span>
                
                 <img src="../public/assets/sprites/${character[Math.floor(Math.random() * (character.length - 0) + 0)]}-1.png" class="player">
             </div>
             `
    }

    player.forEach(player => {
        players.innerHTML += player
    })
    
    console.log(`%c Entrou no game: ${action.id}`, "background:green; color:white;")
    
})

// remove player
socket.on('logout', action =>{

    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>` 

    let playersContainers = players.querySelectorAll('.player-container')
    
    playersContainers.forEach(playerContainer => {
        if(playerContainer.id == action.id){
            playerContainer.remove()
        }
    })

    console.log(`%c Saiu do game: ${action.id}`, "background:orange; color:white;")

})

// game properties ----------------------------------------------

document.addEventListener('keypress', function(event){

    socket.emit('keypress', {key: event.code, id: socket.id})
    
})

// game socket ----------------------------------------------

// detecta tecla
socket.on('keypressed', action => {

    let playersContainers = players.querySelectorAll('.player-container')
    
    playersContainers.forEach(playerContainer => {
        // seleciona o player que pressionou a tecla
        if(playerContainer.id == action.id){
            // console.log(playerContainer, action.id, playerContainer.querySelector('span').textContent)
            switch(action.key){
                case 'Space':
                    socket.emit('player_movement', {Moveto:'top', key: action.key, player: action.id})
                break;
                case 'KeyW':
                    socket.emit('player_movement', {Moveto:'top', key: action.key, player: action.id})
                break;
                case 'KeyA':
                    socket.emit('player_movement', {Moveto:'left', key: action.key, player: action.id})
                break;
                case 'KeyD':
                    socket.emit('player_movement', {Moveto:'right', key: action.key, player: action.id})
                break;
            }
        }
    })

})



// detecta movimento do player
socket.on('connect', ()=>{
    console.log('Conectados')
})

socket.on('player_move', action=>{
    console.log(`%c Apertou uma tecla (${action.key}): ${action.player}`, "background:blue; color:white;")

    let container = Array.from(players.querySelectorAll(`.player-container`))

    container.find(currentPlayer => {
        return currentPlayer.id = action.player;
    })

    container.forEach(currentPlayer =>{
        switch(action.key){
            case 'Space':
                if(currentPlayer.id == action.player){
                    console.log(currentPlayer)
                    currentPlayer.style.bottom = "18%";
                    setTimeout(()=>{
                        currentPlayer.style.bottom = '11%';
                    }, 200)
                }
            break;
        }
    })

    // switch(action.key){
    //     case 'Space':
    //         console.log(container)
    //         container.style.bottom = "18%";
    //         setTimeout(()=>{
    //             container.style.bottom = '11%';
    //         }, 200)
    //     break;
    //     case 'KeyW':
    //         console.log(container)
    //         container.style.bottom = "20%";
    //         setTimeout(()=>{
    //             container.style.bottom = '11%';
    //         }, 200)
    //     break;
    //     case 'KeyA':
    //         // let currentRight = parseInt(window.getComputedStyle(container).left)
    //         // console.log(currentRight)
    //         // container.style.left = `${(currentRight - 100)}px`;
    //     break;
    //     case 'KeyD':
    //         // let currentLeft = parseInt(window.getComputedStyle(container).left)
    //         // console.log(currentLeft)
    //         // container.style.left = `${(currentLeft + 100)}px`;
    //     break;
    // }
})