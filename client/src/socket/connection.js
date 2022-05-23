import io from 'socket.io-client';

var socket = io('http://localhost:3000');

export default socket;