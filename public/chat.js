"use strict";

const socket = io("ws://localhost:3000");

const item = document.createElement("li");

//joining chat room

//Room choosing
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const room = document.getElementById("room");
  const roomHeader = document.getElementById("roomH");

  console.log(room.value);
  socket.emit("joinRoom", room.value);
  roomHeader.innerHTML = room.value;
  item.innerHTML = "";
});
socket.on("message", (msg) => {
  const message = document.createElement("li");
  message.innerHTML = msg;
  item.appendChild(message);

  console.log(msg);
});

//message output
document.getElementById("messageBox").addEventListener("submit", (event) => {
  event.preventDefault();
  const inpNickName = document.getElementById("nickname");
  const inp = document.getElementById("m");
  socket.emit("username", inpNickName.value);
  socket.emit("chat message", inp.value);
  inp.value = "";
  inpNickName.value = "";
});

socket.on("username", (msg) => {
  const username = document.createElement("li");
  username.innerHTML = msg + " says";
  item.appendChild(username);
});

socket.on("chat message", (msg) => {
  const text = document.createElement("li");
  text.innerHTML = msg;
  item.appendChild(text);
});

document.getElementById("messages").appendChild(item);
