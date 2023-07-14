import socket from '@core/server';

class GameSocket {
    constructor() {}

    prepare() {
        socket.emit('game_started');
        socket.on('game_started', (host) => {
            console.log('prepare', host);
        });
    }
}

export default GameSocket;
