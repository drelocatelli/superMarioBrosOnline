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

        this.newConnection = this.socket.handshake.address == '::1' ? '127.0.0.1' : this.socket.handshake.address.replace('::ffff:', '');

        //this.users = io.engine.clientsCount;

        globals.users.add({ id: socket.id, color: this.color, ip: this.newConnection });

        // check user already exists by ip
        //if (Array.from(globals.users).filter((user) => user.ip === this.newConnection).length == 1) {
        this.transmit('login', { users: Array.from(globals.users), color: this.color, id: this.socket.id, ip: this.newConnection });
        /*} else {
            // remove
            console.log('Player already exists');
            globals.users.delete(Array.from(globals.users).find((user) => user.ip === this.newConnection));
        } */

        this.socket.on('disconnect', () => {
            console.log('Saiu:', this.socket.id);
            this.socket.removeAllListeners();
            this.transmit('logout', { id: this.socket.id });
            globals.users.delete(Array.from(globals.users).find((user) => user.id === this.socket.id));
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
            this.transmit('host_setted', this.hostDetails);
        });

        this.socket.on('keydown', (event) => {
            this.transmit('keydown', event);
        });

        this.socket.on('keyup', (event) => {
            this.transmit('keyup', event);
        });

        this.socket.on('player_position', (action) => {
            this.transmit('player_position', action);
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
            this.hostDetails = event;
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
