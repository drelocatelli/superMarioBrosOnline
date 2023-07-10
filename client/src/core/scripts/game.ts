import Server from '@core/server';
import Player from './player';
import { BehaviorSubject } from 'rxjs';

class Game extends Server {
    players = new BehaviorSubject<Player[]>([]);

    constructor() {
        super();
        //this.listen().connection();
    }

    create() {
        return {
            player: (player: Player) => this.players.next([...this.players.value, player]),
        };
    }

    listen() {
        const connection = () => {
            this.socket?.on('connect', () => {
                console.log('e');
            });
            this.players.subscribe((players) => {
                players.forEach((player) => {
                    player.animate();
                });
            });
        };

        return {
            connection,
        };
    }
}

export default Game;
