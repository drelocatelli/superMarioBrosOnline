const express = require('express')
const app = express()
const path = require('path')

const http = require('http')

const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))

app.get('/', function(req, res){
    res.render('index', {name: 'Super Mario Bros Online', root: path.resolve(path.dirname(''))})
})

let users = 0;

io.on('connection', (socket) => {
    users++;

    io.sockets.emit('login', {users});

    socket.on('disconnect', (socket) =>{
        users--;
        io.sockets.emit('login', {users});
    })
    
})


server.listen(3000)