import { SERVER, socket } from "../../../socket/connection"

export async function setPublicIp() {
    const ip = await fetch(`${SERVER}/ip`)
    const input = document.querySelector('input')

    const response = await ip.json()

    input.value = response.publicIp
}

export async function connect() {

    
    
    const connectionsBar = document.querySelector('connections')

    socket.on('login', action => {
        console.log('Connected at server')

        // set total players online
        connectionsBar.querySelector('li#users').innerHTML = `<li>${action.users} player(s)</li>`

    })
}
