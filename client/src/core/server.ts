import { Socket, io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

class Server {
    socket?: Socket;

    constructor() {
        this.defineSocket();
    }

    async defineSocket() {
        let serverUrl = 'http://localhost:'.concat(import.meta.env.VITE_WS_PORT);
        try {
            const localServer = await fetch('serverUrl');
            if (localServer.status == 404) {
                serverUrl = 'http://' + import.meta.env.VITE_WS_SERVER.concat(':' + import.meta.env.VITE_WS_PORT);
            }
        } catch (err) {
            console.dir({ err });
        }
        this.socket = io(serverUrl, {
            path: 'ws',
            transports: ['websocket'], // Specify WebSocket as the transport
        });
    }
}

export default Server;
