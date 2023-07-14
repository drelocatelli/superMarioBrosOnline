import { io } from 'socket.io-client';

let url = new URL(window.location.href);
let serverUrl = `${url.protocol}//${url.hostname}:${import.meta.env.VITE_WS_PORT}/ws`;
let socket = io(serverUrl);

export default socket;
