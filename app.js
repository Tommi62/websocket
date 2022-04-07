'use strict';

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.static('public'));
const http = createServer(app);
const io = new Server(http);
const port = process.env.PORT || 3000;

let usernames = [];
let rooms = [];
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
    for(let i = 0; i < rooms.length; i++) {
      if (rooms[i].userId === socket.id) {
        rooms.splice(i, 1);
      }
    }
    for(let i = 0; i < usernames.length; i++) {
      if (usernames[i].id === socket.id) {
        usernames.splice(i, 1);
      }
    }
  });

  socket.on('username', (msg) => {
    const userObject = {
      id: socket.id,
      username: msg,
    };
    usernames.push(userObject);
    socket.emit('username', msg);
  });

  socket.on('join room', (msg) => {
    let user = '';
    for(let i = 0; i < usernames.length; i++) {
      if (usernames[i].id === socket.id) {
        user = usernames[i].username;
      }
    }
    socket.join(msg);
    const roomObject = {
      userId: socket.id,
      room: msg,
    }
    rooms.push(roomObject);
    console.log(user, 'joined room ', msg, rooms);
    socket.emit('join room', 'Joined succesfully');
  });

  socket.on('leave room', (msg) => {
    for(let i = 0; i < rooms.length; i++) {
      if (rooms[i].userId === socket.id) {
        socket.leave(rooms[i].room);
        rooms.splice(i, 1);
      }
    }
    socket.emit('leave room', 'Leaved succesfully');
  });

  socket.on('chat message', (msg) => {
    let user = '';
    for(let i = 0; i < usernames.length; i++) {
      if (usernames[i].id === socket.id) {
        user = usernames[i].username;
      }
    }
    const messageObject = {
      username: user,
      message: msg,
    }
    let roomName = '';
    for(let i = 0; i < rooms.length; i++) {
      if (rooms[i].userId === socket.id) {
        roomName = rooms[i].room;
      }
    }
    io.to(roomName).emit('chat message', messageObject);
  });
});

http.listen(port, () => {
  console.log(`Socket.io chat app listening on port ${port}!`);
});
