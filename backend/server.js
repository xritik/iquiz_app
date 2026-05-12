const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = 5000;
require('./db');

app.use(cors({ origin: '*' }));
app.use(express.json());

// Attach io to app so routes can emit events
app.set('io', io);

const signupRoute = require('./routes/SignupRoutes');
const loginRoute = require('./routes/LoginRoutes');
const gameRoute = require('./routes/WebRunningRoutes');
const iquizRoute = require('./routes/IQuizRoutes');
const runningIQuizRoute = require('./routes/RunningIQuizRoutes');

app.use('/signUp', signupRoute);
app.use('/login', loginRoute);
app.use('/start-game', gameRoute);
app.use('/iquiz', iquizRoute);
app.use('/runningIQuiz/', runningIQuizRoute);

// ─── Socket.io connection handling ────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Host joins a room identified by the game pin
  socket.on('host:join', (pin) => {
    socket.join(`game:${pin}`);
    console.log(`Host joined room game:${pin}`);
  });

  // Player joins a room identified by the game pin
  socket.on('player:join', (pin) => {
    socket.join(`game:${pin}`);
    console.log(`Player joined room game:${pin}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log('Server is running at port', PORT));