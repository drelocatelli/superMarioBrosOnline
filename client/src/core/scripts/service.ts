import PlayerSocket from './sockets/player';

class Service {
    static sockets = {
        player: new PlayerSocket(),
    };
}

export default Service;
