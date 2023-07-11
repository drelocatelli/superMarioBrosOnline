import PlayerSocket from './player';

class Sockets {
    sockets;

    constructor() {
        this.sockets = {
            player: new PlayerSocket(),
        };
    }
}

export default Sockets;
