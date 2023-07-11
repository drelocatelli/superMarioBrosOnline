import Server from '@core/server';
import Player from '../player';
import _ from 'lodash';

class PlayerSocket extends Server {
    players: Player[] = [];

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
        const connection = () => {
            this.socket?.subscribe((socket) => {
                socket?.on('login', (e: ILogin) => {
                    console.log(`%c Joined to game: ${e.id}/${e.ip}`, 'background:green; color:white; font-size:18px;');
                    e.users.forEach((user) => this.create(new Player({ id: user.id, color: user.color, socketId: socket.id })));
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
                    //socket?.emit('player_position', { position: this.get(socket.id)?.position, id: socket.id });
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
                                const p = this.get(player.id)!;
                                if (p.position.y >= Player.defaultProps.maxJumpPos) {
                                    p.velocity.y -= Player.defaultProps.velocity;
                                }
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

                // player position
                socket?.on('player_position', (props: { id: string; position: { x: number; y: number } }) => {
                    const player = this.get(props.id);
                    if (player) player.position = props.position;
                });
            });
        };

        return {
            connection,
            keyboards,
        };
    }

    initialAnimation(id: string) {
        this.get(id)?.animate();
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
