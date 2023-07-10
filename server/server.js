const express = require('express');
const app = express();
const path = require('path');
const ip = require('ip');
const axios = require('axios');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

require('dotenv').config();

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use('/public', express.static('public'));

app.get('/ip', (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.ipify.org?format=json',
    })
        .then((response) => {
            return res.json({
                publicIp: response.data.ip,
                privateIp: ip.address(),
                isPrivate: ip.isPrivate(response.data.ip),
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

let allUsers = [];
io.of('/ws').on('connection', (socket) => {
    let hostDetails = [];
    let usersDetails = [];

    allUsers.push(socket.id);

    let users = io.engine.clientsCount;

    let newConnection = socket.handshake.address == '::1' ? '127.0.0.1' : socket.handshake.address.replace('::ffff:', '');
    console.log('\nUsuário conectado:', newConnection);

    transmit('login', { users: allUsers, id: socket.id, ip: newConnection });

    socket.on('disconnect', () => {
        console.log('Saiu:', socket.id);
        socket.removeAllListeners();
        transmit('logout', { id: socket.id });
        allUsers = allUsers.filter((user) => user != socket.id);
        let removeOfUsersDetails = JSON.parse(JSON.stringify(usersDetails));
        removeOfUsersDetails = removeOfUsersDetails.filter((userDetail) => userDetail.id != socket.id);
        usersDetails = removeOfUsersDetails;
    });

    socket.on('set_user_details', (event) => {
        addOrReplaceUsersDetails(event);
        transmit('user_setted', { usersDetails });
    });

    socket.on('set_host_details', (event) => {
        addorReplaceHostDetails(event);
        transmit('host_setted', hostDetails);
    });

    socket.on('keypress', (event) => {
        transmit('keypressed', event);
    });

    socket.on('player_movement', (action) => {
        transmit('player_move', { ...action, hostId: hostDetails.hostId });
    });

    function transmit(name, event) {
        socket.broadcast.emit(name, event);
        socket.emit(name, event);
    }

    function addorReplaceHostDetails(event) {
        const index = usersDetails.findIndex((el) => el.hostId === event.hostId);

        if (index === -1) {
            // adiciona host se nao existir
            hostDetails = event;
        }
    }

    function addOrReplaceUsersDetails(event) {
        const index = usersDetails.findIndex((el) => el.id === event.id);

        if (index == -1) {
            // adiciona usuario se nao existir
            usersDetails.push(event);
        }

        console.log('USERS:', usersDetails);
    }
});

server.listen(process.env.PORT || 3001);
