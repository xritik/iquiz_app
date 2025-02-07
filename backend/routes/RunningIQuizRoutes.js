const express = require('express');
const router = express.Router();
const RunningIQuiz = require('../models/runningIQuiz');

router.post('/host', async (req, res) => {
    const { loggedinUser, id, pin } = req.body;
    // console.log(loggedinUser, id, pin);

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
        console.error(error);
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
        res.status(400).json({ message:'IQuiz not found' });
    }else{
        console.log(iquiz);
    }
});

router.get('/status/:storedPin', async (req, res) => {
    const { storedPin } = req.params;
    const iquiz = await RunningIQuiz.findOne({ pin: storedPin });
    if(iquiz){
        res.status(200).json({ status:iquiz.status, index:iquiz.shownQuestionIndex, timer:iquiz.shownQuestionTimer, id:iquiz.iquizId });
    }else if(!iquiz){
        res.status(400).json('None');
    }else{
        console.log(iquiz);
    }
});

router.post('/status', async (req, res) => {
    const { pin, status, index, timer } = req.body;
    
    try {
        const iquiz = await RunningIQuiz.findOneAndUpdate(
            { pin: pin },  // Find the quiz by PIN
            { $set: { status: status, shownQuestionIndex: index, shownQuestionTimer: timer  } }, // Update status
            { new: true }  // Return the updated document
        );
        if (!iquiz) {
            return res.status(404).json({ message: 'Quiz not found!' });
        }

        res.status(200).json({ message: 'Status updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, Please try again!' });
    }
});

router.post('/statusAnswering', async (req, res) => {
    const { pin, status } = req.body;
    
    try {
        const iquiz = await RunningIQuiz.findOneAndUpdate(
            { pin: pin },  // Find the quiz by PIN
            { $set: { status: status } }, // Update status
            { new: true }  // Return the updated document
        );
        if (!iquiz) {
            return res.status(404).json({ message: 'Quiz not found!' });
        }

        res.status(200).json({ message: 'Status updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, Please try again!' });
    }
});

router.post('/setMarks', async (req, res) => {
    const { storedPin, storedName, myMarks, index } = req.body;
    console.log(storedPin, storedName, myMarks, index)

    try{
        const updatedQuiz = await RunningIQuiz.findOneAndUpdate(
            { pin: storedPin, "players.name": storedName },
            {
                $set: { [`players.$.scores.${index}`]: myMarks } // Updates if exists, inserts if not
            },
            { new: true }
        );
    }catch(error){
        console.error(error);
    }
});

module.exports = router;