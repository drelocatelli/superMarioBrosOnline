import socket from '@core/server';
import PlayerSocket from './player';
import useGlobalState from '@core/store/global';

function ScreenLevel(this: PlayerSocket) {
    return {
        set: (props: { playerId: string; level: number }) => socket.emit('screen_level', { id: props.playerId, level: props.level }),
        listen: () => {
            socket.on('screen_level', (props: { id: string; level: number }) => {
                const { game: gameState } = useGlobalState();
                const playerChanges = this.players.find((player) => player.id === props.id);
                // change player opacity if diff screens
                if (playerChanges) playerChanges.screenLevel = props.level;
            });
        },
    };
}

export default ScreenLevel;
