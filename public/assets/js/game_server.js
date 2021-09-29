const socket = io()

let connectionsEl = document.querySelector('connections')

let players = document.querySelector('.players') 

let character = [
    "Mario",
    "Luigi",
    "Yoshi"
]

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


    })