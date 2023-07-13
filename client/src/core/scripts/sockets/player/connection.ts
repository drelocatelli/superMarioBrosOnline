import socket from '@core/server';
import PlayerSocket from './player';
import Player from '@core/scripts/player/player';

interface ILogin {
    id: string;
    ip: string;
    users: {
        id: string;
        color: string;
    }[];
}

function Connection(this: PlayerSocket) {
    console.log(socket);
    socket.on('login', (e: ILogin) => {
        console.log(`%c Joined to game: ${e.id}/${e.ip}`, 'background:green; color:white; font-size:18px;');
        e.users.forEach((user) => this.create(new Player({ id: user.id, color: user.color, socketId: socket.id })));
    });
    socket.on('logout', (e: { id: string }) => {
        console.log(`%c Exited from game: ${e.id}`, 'background:red; color:white; font-size:18px;');
        this.remove(e.id);
    });
}

export default Connection;
