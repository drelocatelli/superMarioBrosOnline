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

    player.push(`<div class="player-container" id="${action.id}">
                <span class="name">Player</span>
            
                <img src="../public/assets/sprites/${character[Math.floor(Math.random() * (character.length - 0) + 0)]}-1.png" class="player">
            </div>
            `)

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

document.addEventListener('keyup', (key) => {

    socket.emit('keypress', {key: key.code, id: socket.id})
    
})

socket.on('connected', (socket)=>{
    io.sockets.emit('login', {users, id: socket.id});
})

socket.on('keypressed', event => {

    console.log(`%c Apertou uma tecla (${event.key}): ${event.id}`, "background:blue; color:white;")
    
    let playerContainer = document.querySelectorAll('.player-container')
    let pcontainer = Array.from(playerContainer)

    let uniqueContainer = pcontainer.find(x => x.id === event.id)

    switch(event.key){
        case 'Space':
            socket.emit('player_movement', {position: 'up' , id:event.id})
        break;
    }
    
})


socket.on('player_move', (event) => {

    let playerContainer = document.querySelectorAll('.player-container')
    let pcontainer = Array.from(playerContainer)

    let uniqueContainer = pcontainer.find(x => x.id === event.action.id)

    if(uniqueContainer == undefined){
        players.innerHTML += `
        <div class="player-container" id="${event.action.id}">
                <span class="name">Player</span>
            
                <img src="../public/assets/sprites/${character[Math.floor(Math.random() * (character.length - 0) + 0)]}-1.png" class="player">
            </div>
        `
    }

    switch(event.action.position){
        case 'up':
            uniqueContainer.style.bottom = "18%"
        break;
    }
    
    
})
