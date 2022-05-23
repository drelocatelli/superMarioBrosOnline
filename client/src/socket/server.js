const SERVER_PORT = 3001;
const SERVER = `http://localhost:${SERVER_PORT}`;
const WEBSOCKET = `${SERVER}/ws`;

async function getPublicIp() {

    const location = new URL(window.location.href)

    console.log(location)

    const ip = await fetch(`${location.protocol}//${location.hostname}:${SERVER_PORT}/ip`)
    const port = new URL(window.location.href).port

    const response = await ip.json()

    return `${response.publicIp}:${port}`

}

export { SERVER, WEBSOCKET, SERVER_PORT, getPublicIp };