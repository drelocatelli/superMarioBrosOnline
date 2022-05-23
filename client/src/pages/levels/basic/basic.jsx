import {SERVER, WEBSOCKET} from "../../../socket/server";
import io from 'socket.io-client'

export async function initialize() {
    setPublicIp();

    const socket = io(WEBSOCKET)

    // do login
    connect(socket)
}

async function setPublicIp() {
    const ip = await fetch(`${SERVER}/ip`)
    const input = document.querySelector('input')

    const response = await ip.json()

    input.value = response.publicIp
    // input.value = ip
}

async function connect(socket) {

    socket.on('connect', () => {
        console.log('Connected')

        socket.on('login', () => {
            console.log('login')
        })
        
    })
}