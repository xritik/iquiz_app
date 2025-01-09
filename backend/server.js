const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const PORT = 5000;
require('./db');

const corsOptions = {
    origin: 'http://localhost:3000',  // Allow only requests from this origin
    credentials: true,                // Allow credentials (cookies) to be sent
};
app.use(cors(corsOptions));

app.use(express.json());


const gameRoutes = require('./routes/WebRunningRoutes');


app.use('/start-game', gameRoutes);


app.listen(PORT, () => console.log('Server is running at port ', PORT));