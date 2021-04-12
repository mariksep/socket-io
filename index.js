"use strict";

const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");

app.use(express.static("public"));
const server = http.Server(app);
//run client connection
let connectedUsers = [];

const io = socketio(server);
io.on("connect", (socket) => {
  //console.log("a user connected", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    // console.log("joinRoom:", room);
  });

  socket.on("username", (username) => {
    //  console.log("username:", username);
    io.emit("username", username);
  });

  socket.on("chat message", (msg) => {
    //  console.log("message: ", msg);
    io.emit("chat message", msg);
  });
  connectedUsers.push(socket.id);

  // Emit to myself the other users connected array to start a connection with each them
  const otherUsers = connectedUsers.filter(
    (socketId) => socketId !== socket.id
  );
  socket.emit("other-users", otherUsers);
  console.log(otherUsers);

  // Send Offer To Start Connection
  socket.on("offer", (socketId, description) => {
    socket.to(socketId).emit("offer", socket.id, description);
  });

  // Send Answer From Offer Request
  socket.on("answer", (socketId, description) => {
    socket.to(socketId).emit("answer", description);
  });

  // Send Signals to Establish the Communication Channel
  socket.on("candidate", (socketId, candidate) => {
    socket.to(socketId).emit("candidate", candidate);
  });

  // Remove client when socket is disconnected
  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter(
      (socketId) => socketId !== socket.id
    );
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
