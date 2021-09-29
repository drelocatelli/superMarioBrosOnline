const socket = io()

let connectionsEl = document.querySelector('connections')

let players = document.querySelector('.players') 

let character = [
    "Mario",
    "Luigi",
    "Yoshi"
]

// player logado
socket.on('login', action =>{
    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>` 

    // player elements
    let player = new Array(parseInt(action.users))

    // seta player na tela

    for(let i = 0; i < parseInt(action.users); i++){
        player[i] = `<div class="player-container" data-id="${action.id}">
                 <span class="name">Player ${i+1}</span>
                
                 <img src="../public/assets/sprites/mario-1.png" class="player">
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
        if(playerContainer.dataset.id == action.id){
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
socket.on('keypressed', action => {

    let playersContainers = players.querySelectorAll('.player-container')
    
    playersContainers.forEach(playerContainer => {
        // seleciona o player que pressionou a tecla
        if(playerContainer.dataset.id == action.id){
            console.log(playerContainer)
            playerContainer.querySelector('img').style.top = '10px'
        }
    })
    
    console.log(`%c Apertou uma tecla (${action.key}): ${action.id}`, "background:blue; color:white;")

})

