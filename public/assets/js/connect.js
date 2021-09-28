const socket = io()

let connectionsEl = document.querySelector('connections')
let connectionsList = document.querySelector('connections ul#list')

let player = [
    "Mario",
    "Luigi",
    "Yoshi"
]

socket.on('login', login =>{
    connectionsEl.querySelector('li#users').innerHTML = `<li>${login.users} player(s)</li>`    
})
