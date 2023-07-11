import Server from '@core/server';

class GameSocket extends Server {
    constructor() {
        super();

        this.socket.subscribe((socket) => {
            socket?.on('play_game', () => {
                console.log('game started');
            });
        });
    }
}

export default GameSocket;
