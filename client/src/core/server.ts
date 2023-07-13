import { io } from 'socket.io-client';

let serverUrl = 'http://localhost:'.concat(import.meta.env.VITE_WS_PORT);
let socket = io(serverUrl);

async function Server() {
    try {
        const localServer = await fetch(serverUrl + '/ip');
        if (localServer.status == 404) {
            serverUrl = 'http://' + import.meta.env.VITE_WS_SERVER.concat(':' + import.meta.env.VITE_WS_PORT);
        }
    } catch (err) {
        console.dir({ err });
    }
    serverUrl = `${serverUrl}/ws`;
    socket = io(serverUrl);
}
await Server();

export default socket;
