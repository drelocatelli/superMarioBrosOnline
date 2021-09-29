const socket = io()

let connectionsEl = document.querySelector('connections')

let playersEl = document.querySelector('.players') 

let player = [
    "Mario",
    "Luigi",
    "Yoshi"
]

socket.on('login', action =>{
    connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>` 

    // player elements
    let players = new Array(parseInt(action.users))

    // seta player na tela

    for(let i = 0; i < parseInt(action.users); i++){
        players[i] = `<div class="player-container" data-id="${action.id}">
                 <span class="name">Player ${i+1}</span>
                
                 <img src="../public/assets/sprites/mario-1.png" class="player">
             </div>
             `
    }

    players.forEach(player => {
        playersEl.innerHTML += player
    })
    
})

// remove player
socket.on('logout', action =>{

        connectionsEl.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>` 

        let playersContainers = playersEl.querySelectorAll('.player-container')
        
        playersContainers.forEach(playerContainer => {
            if(playerContainer.dataset.id == action.id){
                playerContainer.remove()
            }
        })


    })