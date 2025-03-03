const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketIo(server);

let users = [];

let connectedClients = [];

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Add new user to users list
  users.push({ id: socket.id });

  connectedClients.push(socket.id);

  // Send the updated user list to all clients
  io.emit('updateUserList', Object.values(users));

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('updateUserList', Object.values(users));
  });

  // Handle private offer from one user to another
  socket.on('sendOffer', ({ offer, targetUserId }) => {
    io.to(targetUserId).emit('receiveOffer', { offer, fromUserId: socket.id });
  });

  // Handle private answer from one user to another
  socket.on('sendAnswer', ({ answer, targetUserId }) => {
    io.to(targetUserId).emit('receiveAnswer', {
      answer,
      fromUserId: socket.id,
    });
  });

  // Handle ICE candidates
  socket.on('sendCandidate', ({ candidate, targetUserId }) => {
    io.to(targetUserId).emit('receiveCandidate', {
      candidate,
      fromUserId: socket.id,
    });
  });

  socket.on('requestUserList', () => {
    socket.emit('userList', connectedClients);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
