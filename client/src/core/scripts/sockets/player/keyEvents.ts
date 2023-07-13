import Player from '@core/scripts/player/player';
import PlayerSocket from './player';
import socket from '@core/server';

function KeyEventsSocket(this: PlayerSocket) {
    const listen = () => {
        document.addEventListener('keydown', (e) => {
            socket.emit('keydown', { key: e.code, id: socket.id });
            const currentPlayer = this.players.find((player) => player.currentPlayer);
            if (currentPlayer != undefined) {
                switch (e.key) {
                    case 'KeyA':
                    case 'ArrowLeft':
                        currentPlayer.keys.left.pressed = true;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        currentPlayer.keys.right.pressed = true;
                        break;
                    case 'Space':
                    case 'KeyW':
                    case 'ArrowUp':
                        currentPlayer.speed.y -= Player.defaultProps.speed;
                        // }
                        break;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            socket.emit('keyup', { key: e.code, id: socket.id });
            const currentPlayer = this.players.find((player) => player.currentPlayer);
            if (currentPlayer != undefined) {
                switch (e.key) {
                    case 'KeyA':
                    case 'ArrowLeft':
                        currentPlayer.keys.left.pressed = false;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        currentPlayer.keys.right.pressed = false;
                        break;
                }
            }
        });

        socket.on('keydown', (player: { key: string; id: string }) => {
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
                        // if (p.position.y >= Player.defaultProps.maxJumpPos) {
                        p.speed.y -= Player.defaultProps.speed;
                        // }
                        break;
                }
        });
        socket.on('keyup', (player: { key: string; id: string }) => {
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
        socket.on('player_position', (props: { id: string; position: { x: number; y: number } }) => {
            const player = this.get(props.id);
            if (player) player.position = props.position;
        });
    };

    return {
        listen,
    };
}

export default KeyEventsSocket;
