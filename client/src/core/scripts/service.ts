import GameSocket from './sockets/game';
import PlayerSocket from './sockets/player/player';

class Service {
    static sockets = {
        game: new GameSocket(),
        player: new PlayerSocket(),
    };
}

export default Service;
