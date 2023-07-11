const globals = require('./constants');

class UserSocket {
    colors = ['green', 'blue', 'yellow', 'red'];
    hostDetails;
    userDetails;
    color;
    socket;

    constructor(socket) {
        this.socket = socket;
        this.hostDetails = [];
        this.usersDetails = [];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];

        globals.allUsers.add({ id: socket.id, color: this.color });

        //this.users = io.engine.clientsCount;

        this.newConnection = this.socket.handshake.address == '::1' ? '127.0.0.1' : this.socket.handshake.address.replace('::ffff:', '');
        console.log('\nUsuário conectado:', this.newConnection);

        this.transmit('login', { users: Array.from(globals.allUsers), color: this.color, id: this.socket.id, ip: this.newConnection });

        this.socket.on('disconnect', () => {
            console.log('Saiu:', this.socket.id);
            this.socket.removeAllListeners();
            this.transmit('logout', { id: this.socket.id });
            globals.allUsers.delete(Array.from(globals.allUsers).find((user) => user.id === this.socket.id));
            let removeOfUsersDetails = JSON.parse(JSON.stringify(this.usersDetails));
            removeOfUsersDetails = removeOfUsersDetails.filter((userDetail) => userDetail.id != this.socket.id);
            this.usersDetails = removeOfUsersDetails;
        });

        this.socket.on('set_user_details', (event) => {
            addOrReplaceUsersDetails(event);
            this.transmit('user_setted', { usersDetails });
        });

        this.socket.on('set_host_details', (event) => {
            addorReplaceHostDetails(event);
            this.transmit('host_setted', hostDetails);
        });

        this.socket.on('keypress', (event) => {
            this.transmit('keypressed', event);
        });

        this.socket.on('player_movement', (action) => {
            this.transmit('player_move', { ...action, hostId: hostDetails.hostId });
        });
    }

    transmit(name, event) {
        this.socket.broadcast.emit(name, event);
        this.socket.emit(name, event);
    }

    addorReplaceHostDetails(event) {
        const index = usersDetails.findIndex((el) => el.hostId === event.hostId);

        if (index === -1) {
            // adiciona host se nao existir
            hostDetails = event;
        }
    }

    addOrReplaceUsersDetails(event) {
        const index = usersDetails.findIndex((el) => el.id === event.id);

        if (index == -1) {
            // adiciona usuario se nao existir
            usersDetails.push(event);
        }

        console.log('USERS:', usersDetails);
    }
}

module.exports = UserSocket;
