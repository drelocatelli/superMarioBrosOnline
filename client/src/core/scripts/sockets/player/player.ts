import Player from '../../player/player';
import _ from 'lodash';
import KeyEventsSocket from './keyEvents';
import Connection from './connection';

class PlayerSocket {
    players: Player[] = [];

    first() {
        return this.players[0];
    }

    get(id: string) {
        return this.players.find((p) => p.id == id);
    }

    create(player: Player) {
        this.players = _.uniqBy([...this.players, player], 'id');
        this.initialAnimation(player.id);
    }

    remove(id: string) {
        this.players.find((p) => p.id == id)?.remove();
        this.players = _.reject(this.players, { id });
    }

    listen() {
        return {
            connection: () => Connection.call(this),
            keyEvents: KeyEventsSocket.call(this).listen,
        };
    }

    initialAnimation(id: string) {
        this.get(id)?.animate();
    }
}

export default PlayerSocket;
