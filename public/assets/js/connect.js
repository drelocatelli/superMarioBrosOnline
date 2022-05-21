const socket = io()

let connectionsEl = document.querySelector('connections')

socket.on('login', login =>{
    connectionsEl.querySelector('li#users').innerHTML = `<li>${login.users} player(s)</li>`  
})
