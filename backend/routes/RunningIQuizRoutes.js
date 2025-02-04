const express = require('express');
const router = express.Router();
const RunningIQuiz = require('../models/runningIQuiz');

router.post('/host', async (req, res) => {
    const { loggedinUser, id, pin } = req.body;

    try {
        const runningIQuiz = await RunningIQuiz.findOne({ pin: pin });

        if(runningIQuiz){
            return res.status(409).json({ message: 'Pin is already taken!' });
        }else{
            const newRunningIQuiz = new RunningIQuiz({ hoster:loggedinUser, iquizId:id, pin:pin });
            await newRunningIQuiz.save();
            res.status(200).json({ message: 'IQuiz hosted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, Please try again!' });
    }
});

router.delete('/delete/:pin', async (req, res) => {
    const { pin } = req.params;

    try {
        const runningIQuiz = await RunningIQuiz.findOneAndDelete({ pin: pin });

        if(runningIQuiz){
            res.status(200).json({ message: 'IQuiz hosting stopped successfully!' });
        }else{
            res.status(404).json({ message: 'Hosting IQuiz not found to delete, Please try again!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, Please try again!' })
    }
});

router.post('/join', async (req, res) => {
    const { playerName, playerPin } = req.body;

    try {
        const runningIQuiz = await RunningIQuiz.findOne({ pin: playerPin });

        if(runningIQuiz){
            const updatedIQuiz = await RunningIQuiz.findOneAndUpdate(
                { pin: playerPin, "players.name": { $ne: playerName } },
                { $push: { players: { name: playerName, answers: [] } } },
                { new: true }
            );
    
            if (!updatedIQuiz) {
                return res.status(409).json({ message: 'This username has been already taken!' });
            }
    
            res.status(200).json({ message: 'Player added successfully!', });
        }else{
            res.status(404).json({ message: 'Please enter a valid game pin!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, Please try again!' });
    }
});

router.get('/players/:storedPin', async (req, res) => {
    const { storedPin } = req.params;
    const iquiz = await RunningIQuiz.findOne({ pin: storedPin });
    if(iquiz){
        res.status(200).json( iquiz.players );
    }else if(!iquiz){
        res.status(200).json([]);
    }else{
        console.log(iquiz);
    }
});

module.exports = router;