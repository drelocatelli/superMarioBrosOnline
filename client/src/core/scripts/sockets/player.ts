import Server from '@core/server';
import Player from '../player';
import { BehaviorSubject } from 'rxjs';
import _ from 'lodash';

class PlayerSocket extends Server {
    players = new BehaviorSubject<Player[]>([]);

    create(player: Player) {
        const payload = _.uniqBy([...this.players.value, player], 'id');
        this.players.next(payload);
    }

    remove(id: string) {
        this.players.value.find((p) => p.id == id)?.remove();
        this.players.next(_.reject(this.players.value, { id }));
    }

    listen() {
        const connection = () => {
            this.socket?.subscribe((socket) => {
                socket?.on('login', (e: ILogin) => {
                    console.log(`%c Joined to game: ${e.id}/${e.ip}`, 'background:green; color:white; font-size:18px;');
                    e.users.forEach((user) => this.create(new Player(user.id, user.color, user.id === socket.id)));
                });
                socket?.on('logout', (e: { id: string }) => {
                    console.log(`%c Exited from game: ${e.id}`, 'background:red; color:white; font-size:18px;');
                    this.remove(e.id);
                });
            });
        };

        return {
            connection,
        };
    }

    initialAnimation() {
        this.players.subscribe((players) => {
            console.log(players);
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
    users: {
        id: string;
        color: string;
    }[];
}

export default PlayerSocket;
