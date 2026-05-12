// src/socket.js
// Connects to the backend server (Render) where Socket.io actually runs.
// On Vercel the frontend is static — WebSockets must go directly to Render.

import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'], // try WebSocket first, fall back to polling
});

export default socket;