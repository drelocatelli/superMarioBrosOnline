import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

class Server {
    socket = new BehaviorSubject<Socket | undefined>(undefined);

    constructor() {
        this.defineSocket();
    }

    async defineSocket() {
        let serverUrl = 'http://localhost:'.concat(import.meta.env.VITE_WS_PORT);
        try {
            const localServer = await fetch(serverUrl + '/ip');
            if (localServer.status == 404) {
                serverUrl = 'http://' + import.meta.env.VITE_WS_SERVER.concat(':' + import.meta.env.VITE_WS_PORT);
            }
        } catch (err) {
            console.dir({ err });
        }
        serverUrl = `${serverUrl}/ws`;
        this.socket?.next(io(serverUrl));
    }
}

export default Server;
