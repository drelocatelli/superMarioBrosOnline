const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const http = require("http");
const { join } = require("path");

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

    let users = 0;

    let usersDetails = [];

    function addOrReplaceusersDetails(event) {
      const index = usersDetails.findIndex(el => el.id === event.id);

      if (index !== -1) {
        console.log('achou usuario')
      } else {
        usersDetails.push(event);
      }
      console.log(usersDetails)
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

        console.log(usersDetails)
        
      });

      socket.on("keypress", (event) => {
        io.sockets.emit("keypressed", event);
      });

      socket.on("player_movement", (action) => {
        io.sockets.emit("player_move", action);
      });

      socket.on('change_screen', (action) => {
        addOrReplaceusersDetails(action)
        io.sockets.emit('changed_screen', usersDetails)
      });
    });
  }
}

module.exports = new App().server;
