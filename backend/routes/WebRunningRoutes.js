const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

router.post('/', (req, res) => {

    const command = 'cd /home/ritik/Desktop/iquiz_app/player_side && PORT=3001 npm start';

    exec(command, (error, stdout, stderr) => {
        if (error) {
        console.error(`Error starting IQuiz: ${error.message}`);
        return res.status(500).json({ message: 'Failed to start Web 2', error: error.message });
        }

        console.log(`IQuiz started: ${stdout}`);
        res.status(200).json({ message: 'IQuiz started successfully on port 3001' });
    });

})

module.exports = router;
