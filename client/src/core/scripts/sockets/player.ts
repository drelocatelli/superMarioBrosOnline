import Server from '@core/server';
import Player from '../player';
import { BehaviorSubject } from 'rxjs';
import _ from 'lodash';

class PlayerSocket extends Server {
    players = new BehaviorSubject<Player[]>([]);

    get(id: string) {
        return this.players.getValue().find((p) => p.id == id);
    }

    create(player: Player) {
        const payload = _.uniqBy([...this.players.value, player], 'id');
        this.players.next(payload);
    }

    remove(id: string) {
        this.players
            .getValue()
            .find((p) => p.id == id)
            ?.remove();
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
        const keyboards = () => {
            this.socket?.subscribe((socket) => {
                document.addEventListener('keydown', (e) => {
                    socket?.emit('keydown', { key: e.code, id: socket.id });
                });

                document.addEventListener('keyup', (e) => {
                    socket?.emit('keyup', { key: e.code, id: socket.id });
                });

                // player movement
                socket?.on('keydown', (player: { key: string; id: string }) => {
                    if (this.get(player.id) != undefined)
                        switch (player.key) {
                            case 'KeyA':
                            case 'ArrowLeft':
                                this.get(player.id)!.keys.left.pressed = true;
                                break;
                            case 'KeyD':
                            case 'ArrowRight':
                                this.get(player.id)!.keys.right.pressed = true;
                                break;
                            case 'Space':
                            case 'KeyW':
                            case 'ArrowUp':
                                this.get(player.id)!.velocity.y -= Player.defaultProps.velocity;
                                break;
                        }
                });

                socket?.on('keyup', (player: { key: string; id: string }) => {
                    if (this.get(player.id) != undefined)
                        switch (player.key) {
                            case 'Space':
                            case 'KeyW':
                            case 'ArrowUp':
                                break;
                            case 'KeyA':
                            case 'ArrowLeft':
                                this.get(player.id)!.keys.left.pressed = false;
                                break;
                            case 'KeyD':
                            case 'ArrowRight':
                                this.get(player.id)!.keys.right.pressed = false;
                                break;
                        }
                });
            });
        };

        return {
            connection,
            keyboards,
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
