// src/socket.js
// Single shared Socket.io client instance for the whole app.
// Import { socket } wherever you need to emit or listen.

import { io } from 'socket.io-client';

const HOST = window.location.hostname;
const socket = io(`http://${HOST}:5000`, {
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;