const { globals } = require('./constants');

class GameSocket {
    constructor(socket) {
        this.socket = socket;
    }
}

module.exports = GameSocket;
