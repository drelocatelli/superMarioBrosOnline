import Server from '@core/server';
import Player from './player';
import { BehaviorSubject } from 'rxjs';

class Game extends Server {
    players = new BehaviorSubject<Player[]>([]);

    constructor() {
        super();
        this.listen().connection();
        this.initialAnimation();
    }

    create() {
        return {
            player: (player: Player) => this.players.next([...this.players.value, player]),
        };
    }

    listen() {
        const connection = () => {
            this.socket?.subscribe((socket) => {
                socket?.on('login', (e: ILogin) => {
                    console.log(`%c Entrou no game: ${e.id}`, 'background:green; color:white;');
                    console.log(e.users);
                    e.users.forEach((user) => {
                        this.create().player(new Player(user));
                    });
                });
                socket?.on('logout', (e: { id: string }) => {
                    console.log(`%c Saiu do game: ${e.id}`, 'background:red; color:white;');
                });
            });
        };

        return {
            connection,
        };
    }

    initialAnimation() {
        this.players.subscribe((players) => {
            players.forEach((player, i) =>
                setTimeout(() => {
                    player.animate();
                }, i * 500),
            );
        });
    }
}

interface ILogin {
    id: string;
    ip: string;
    users: string[];
}

export default Game;
