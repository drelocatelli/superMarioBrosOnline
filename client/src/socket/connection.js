import env from 'react-dotenv';
import io from 'socket.io-client';

var socket = io(env.SERVER);

export default socket;