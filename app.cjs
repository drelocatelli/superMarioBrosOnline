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

    let users = 0;

    let usersDetails = [];

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

    }

    io.on("connection", (socket) => {
      users++;

      io.sockets.emit("login", { users, id: socket.id });

      socket.on("disconnect", () => {
        users--;
        io.sockets.emit("logout", { users, id: socket.id });

        // remove usuario
        console.log('Saiu:', socket.id)
        let removeOfUsersDetails = JSON.parse(JSON.stringify(usersDetails))
        removeOfUsersDetails = removeOfUsersDetails.filter(userDetail => userDetail.id != socket.id)
        usersDetails = removeOfUsersDetails
        
      });

      socket.on('set_user_details', (event) => {
        addOrReplaceusersDetails(event)
      })

      socket.on("keypress", (event) => {
        io.sockets.emit("keypressed", event);
      });

      socket.on("player_movement", (action) => {
        io.sockets.emit("player_move", action);
      });

      socket.on('change_screen', (action) => {
        setUserScreen(action)
        io.sockets.emit('changed_screen', usersDetails)
      });
    });
  }
}

module.exports = new App().server;
