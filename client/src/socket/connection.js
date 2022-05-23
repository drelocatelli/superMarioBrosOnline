import io from 'socket.io-client';

const SERVER = 'http://localhost:3000'

var socket = io(SERVER);

export {SERVER, socket};