const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const http = require("http");
const { join } = require("path");
const ip = require("ip");
const axios = require('axios')

class App {
  #express;
  server;
  constructor() {
    this.#initialize();
  }

  #initialize() {
    this.#express = express();
    this.server = http.createServer(this.#express);

    const io = socketio(this.server);
    let game = "Super Mario Bros Online";
    const views_path = join(__dirname, `/views`);
    this.#express.set("view engine", "ejs");
    this.#express.use("/public", express.static("public"));

    this.#express.get("/", function (req, res) {
      res.render("index", { name: game, root: path.resolve(path.dirname("")) });
    });
    this.#express.get("/play", function (req, res) {
      res.render("play", { name: game, root: path.resolve(path.dirname("")) });
    });

    this.#express.get('/level/:level', function (req, res) {
        res.render(`lv${req.params.level}`, { name: game, root: path.resolve(path.dirname("")) })
    })

    this.#express.get('/ip', (req, res) => {

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

      if (index == -1) {
        // adiciona usuario se nao existir
        usersDetails.push(event);
      }
    }

    function setUserScreen(event) {
      usersDetails = usersDetails.filter(detail => 
        (detail.id === event.id) ? detail.screen += 1 : detail.screen
      )

      console.log('Mudou screen:', event.id, event.screen)
    }

    io.on("connection", (socket) => {
      let users = io.engine.clientsCount;

      let newConnection = (socket.handshake.address == '::1') ? '127.0.0.1' : socket.handshake.address.replace('::ffff:', '');
      console.log("\nUsuário conectado:", newConnection);

      io.sockets.emit("login", { users, id: socket.id, ip: newConnection });

      socket.on("disconnect", () => {
        users--;
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
    });
  }
}

module.exports = new App().server;
