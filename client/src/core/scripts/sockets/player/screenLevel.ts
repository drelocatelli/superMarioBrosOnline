import socket from '@core/server';
import PlayerSocket from './player';
import Service from '@core/scripts/service';

function ScreenLevel(this: PlayerSocket) {
    return {
        set: (props: { playerId: string; level: number }) => socket.emit('screen_level', { id: props.playerId, level: props.level }),
        listen: () =>
            socket.on('screen_level', (props: { playerId: string; level: number }) => {
                const player = Service.sockets.player.players.find((player) => player.id === props.playerId);
                console.log(Service.sockets.player.players);
            }),
    };
}

export default ScreenLevel;
