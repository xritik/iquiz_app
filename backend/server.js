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


const signupRoute = require('./routes/SignupRoutes');
const loginRoute = require('./routes/LoginRoutes');
const gameRoute = require('./routes/WebRunningRoutes');
const iquizRoute = require('./routes/IQuizRoutes');

            
app.use('/signUp', signupRoute);
app.use('/login', loginRoute);
app.use('/start-game', gameRoute);
app.use('/iquiz', iquizRoute);


app.listen(PORT, () => console.log('Server is running at port ', PORT));