const SERVER_PORT = 3001;
const WEBSOCKET = `${SERVER()}/ws`;

async function getPublicIp() {

    const location = new URL(window.location.href)

    const ip = await fetch(`${location.protocol}//${location.hostname}:${SERVER_PORT}/ip`)
    const port = new URL(window.location.href).port

    const response = await ip.json()

    return `${response.publicIp}:${port}`

}

function SERVER() {

    const location = new URL(window.location.href)
    const ip = `${location.protocol}//${location.hostname}:${SERVER_PORT}`

    return ip;

}

export { SERVER, WEBSOCKET, SERVER_PORT, getPublicIp };