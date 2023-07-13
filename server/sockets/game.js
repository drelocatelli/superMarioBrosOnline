class GameSocket {
    constructor(socket, connectionsCount) {
        this.socket = socket;

        socket.on('game_started', () => {
            if (connectionsCount >= 1) {
                socket.emit('game_started');
            }
        });
    }
}

module.exports = GameSocket;
