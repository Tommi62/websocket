'use strict';

const socket = io();

document.querySelector('#nameForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const inp = document.getElementById('n');
    socket.emit('username', inp.value);
    inp.value = '';
  });

  document.querySelector('#roomForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const inp = document.getElementById('r');
    socket.emit('join room', inp.value);
    inp.value = '';
  });  

document.querySelector('#messageForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const inp = document.getElementById('m');
  socket.emit('chat message', inp.value);
  inp.value = '';
});

document.querySelector('#leave').addEventListener('click', (event) => {
    event.preventDefault();
    socket.emit('leave room', 'leave');
  });

socket.on('username', (msg) => {
    console.log(msg);
    const nameDiv = document.getElementById('username');
    nameDiv.style.display = 'none';
    const roomDiv = document.getElementById('rooms');
    roomDiv.style.display = 'block';
  });

  socket.on('join room', (msg) => {
    console.log(msg);
    const roomDiv = document.getElementById('rooms');
    roomDiv.style.display = 'none';
    const chatDiv = document.getElementById('chat');
    chatDiv.style.display = 'block';
  });

socket.on('chat message', (msg) => {
  console.log('Chat message');
  const item = document.createElement('li');
  item.innerHTML = msg.username + ': ' + msg.message;
  const list = document.getElementById('messages');
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
});

socket.on('leave room', (msg) => {
    console.log(msg);
    const list = document.getElementById('messages');
    list.innerHTML = '';
    const chatDiv = document.getElementById('chat');
    chatDiv.style.display = 'none';
    const roomDiv = document.getElementById('rooms');
    roomDiv.style.display = 'block';
  });
