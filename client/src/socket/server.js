const SERVER_PORT = 3001;
const WEBSOCKET = `${SERVER()}/ws`;

function SERVER() {

    const location = new URL(window.location.href)
    const ip = `${location.protocol}//${location.hostname}:${SERVER_PORT}`

    return ip;

}

export { SERVER, WEBSOCKET, SERVER_PORT };