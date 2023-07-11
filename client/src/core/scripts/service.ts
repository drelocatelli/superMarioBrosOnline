import PlatformSocket from './sockets/platform';
import PlayerSocket from './sockets/player';

class Service {
    static sockets = {
        player: new PlayerSocket(),
        platforms: new PlatformSocket(),
    };
}

export default Service;
