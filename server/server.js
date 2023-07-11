const express = require('express');
const app = express();
const path = require('path');
const ip = require('ip');
const axios = require('axios');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const UserSocket = require('./sockets/user');

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

io.of('/ws').on('connection', (socket) => {
    new UserSocket(socket);
});

server.listen(process.env.PORT || 3001);
