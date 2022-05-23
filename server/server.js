const express = require('express')
const app = express()
const path = require('path')
const ip = require('ip')
const axios = require('axios')
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use('/public', express.static('public'))

app.get('/ip', (req, res) => {

    axios({
        method: 'get',
        url: 'https://api.ipify.org?format=json'
    }).then(response => {
        return res.json(
            {
                publicIp: response.data.ip,
                privateIp: ip.address(),
                isPrivate: ip.isPrivate(response.data.ip)
            });

    }).catch(err => {
        console.log(err)
    })

})


let usersDetails = [];
let hostDetails = {};

function addOrReplaceusersDetails(event) {
  const index = usersDetails.findIndex(el => el.id === event.id);

  // adiciona usuario se nao existir
  if (index == -1) usersDetails.push(event);
}

function setUserScreen(event) {
  usersDetails = usersDetails.filter(detail =>
    (detail.id === event.id) ? detail.screen += 1 : detail.screen
  )

  console.log('Mudou screen:', event.id, event.screen)
}

io.on('connection', (socket) => {
  let users = io.engine.clientsCount;

  let newConnection = (socket.handshake.address == '::1')
    ? '127.0.0.1' 
    : socket.handshake.address.replace('::ffff:', '');
    
  console.log("\nUsuário conectado:", newConnection);

  io.sockets.emit("login", { users, id: socket.id, ip: newConnection });

  socket.on("disconnect", () => {
    io.sockets.emit("logout", { users, id: socket.id });

    // remove usuario
    console.log('Saiu:', socket.id)
    let removeOfUsersDetails = JSON.parse(JSON.stringify(usersDetails))
    removeOfUsersDetails = removeOfUsersDetails.filter(userDetail => userDetail.id != socket.id)
    usersDetails = removeOfUsersDetails
    
  });

  socket.on('set_host_details', (event) => {
    hostDetails = event
    console.log('HOST: ', hostDetails)
    io.sockets.emit('host_setted', hostDetails)
  })

  socket.on('set_user_details', (event) => {
      addOrReplaceusersDetails(event)
  })

  socket.on("keypress", (event) => {
    io.sockets.emit("keypressed", {...event, hostId: hostDetails.id});
  });

  socket.on("player_movement", (action) => {
    io.sockets.emit("player_move", {...action, hostId: hostDetails.id});
  });

  socket.on('change_screen', (action) => {
    setUserScreen(action)
    io.sockets.emit('changed_screen', action)
  });
})

server.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
})
