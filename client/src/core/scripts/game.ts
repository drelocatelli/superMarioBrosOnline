import extender from '@core/utils/extender';
import PlayerSocket from './sockets/player';
import Sockets from './sockets/main';

class Game extends Sockets {
    constructor() {
        super();
        this.sockets.player.listen().connection();
        this.sockets.player.initialAnimation();
    }
}

export default Game;
