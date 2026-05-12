const express = require('express');
const router = express.Router();
const RunningIQuiz = require('../models/runningIQuiz');

// ─── Host an IQuiz ─────────────────────────────────────────────────────────────
router.post('/host', async (req, res) => {
  const { loggedinUser, id, pin } = req.body;
  try {
    const existing = await RunningIQuiz.findOne({ hoster: loggedinUser });
    if (existing) {
      // Allow re-hosting if the previous game is already finished or was abandoned
      if (existing.status === 'Finished' || existing.status === 'notStarted') {
        await RunningIQuiz.findOneAndDelete({ hoster: loggedinUser });
      } else {
        return res.status(409).json({ message: 'You are already hosting an active IQuiz!' });
      }
    }
    const newRunningIQuiz = new RunningIQuiz({
      hoster: loggedinUser,
      pin,
      iquizId: id,
      status: 'notStarted',
    });
    await newRunningIQuiz.save();
    return res.status(200).json({ message: 'IQuiz hosted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Player joins ──────────────────────────────────────────────────────────────
router.post('/join', async (req, res) => {
  const { playerName, playerPin } = req.body;
  const io = req.app.get('io');
  try {
    const runningIQuiz = await RunningIQuiz.findOne({ pin: playerPin });
    if (!runningIQuiz) {
      return res.status(404).json({ message: 'No IQuiz found with this pin!' });
    }
    const nameExists = runningIQuiz.players.some((p) => p.name === playerName);
    if (nameExists) {
      return res.status(409).json({ message: 'This name is already taken!' });
    }
    runningIQuiz.players.push({ name: playerName, scores: [] });
    await runningIQuiz.save();

    // Notify everyone in the room about new player list
    const players = runningIQuiz.players;
    io.to(`game:${playerPin}`).emit('players:update', players);

    return res.status(200).json({ message: 'Joined successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Get players (still used for initial host page load) ──────────────────────
router.get('/players/:pin', async (req, res) => {
  const { pin } = req.params;
  try {
    const runningIQuiz = await RunningIQuiz.findOne({ pin });
    if (!runningIQuiz) {
      return res.status(400).json({ message: 'No IQuiz found!' });
    }
    return res.status(200).json(runningIQuiz.players);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Update game status (start question / next question) ──────────────────────
router.post('/status', async (req, res) => {
  const { pin, status, index, timer } = req.body;
  const io = req.app.get('io');
  try {
    const runningIQuiz = await RunningIQuiz.findOne({ pin });
    if (!runningIQuiz) {
      return res.status(404).json({ message: 'No IQuiz found!' });
    }
    runningIQuiz.status = status;
    runningIQuiz.shownQuestionIndex = index;
    runningIQuiz.shownQuestionTimer = timer;
    await runningIQuiz.save();

    // Push status update to all clients in the room
    io.to(`game:${pin}`).emit('game:statusUpdate', {
      status,
      index,
      timer,
      id: runningIQuiz.iquizId,
      players: runningIQuiz.players,
    });

    return res.status(200).json({ message: 'Status updated!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Set status to Answering or Finished ──────────────────────────────────────
router.post('/statusAnswering', async (req, res) => {
  const { pin, status } = req.body;
  const io = req.app.get('io');
  try {
    const runningIQuiz = await RunningIQuiz.findOne({ pin });
    if (!runningIQuiz) {
      return res.status(404).json({ message: 'No IQuiz found!' });
    }
    runningIQuiz.status = status;
    await runningIQuiz.save();

    io.to(`game:${pin}`).emit('game:statusUpdate', {
      status,
      index: runningIQuiz.shownQuestionIndex,
      timer: runningIQuiz.shownQuestionTimer,
      id: runningIQuiz.iquizId,
      players: runningIQuiz.players,
    });

    // Auto-delete the record 10 seconds after game finishes
    // so the host can start a new game without manual cleanup
    if (status === 'Finished') {
      setTimeout(async () => {
        try {
          await RunningIQuiz.findOneAndDelete({ pin });
          console.log(`Cleaned up finished game: ${pin}`);
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      }, 10000);
    }

    return res.status(200).json({ message: 'Status updated!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Get status (used for initial page load / reconnect) ──────────────────────
router.get('/status/:pin', async (req, res) => {
  const { pin } = req.params;
  try {
    const runningIQuiz = await RunningIQuiz.findOne({ pin });
    if (!runningIQuiz) {
      return res.status(400).json({ message: 'No IQuiz found!' });
    }
    return res.status(200).json({
      status: runningIQuiz.status,
      index: runningIQuiz.shownQuestionIndex,
      timer: runningIQuiz.shownQuestionTimer,
      id: runningIQuiz.iquizId,
      players: runningIQuiz.players,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Set player marks ─────────────────────────────────────────────────────────
router.post('/setMarks', async (req, res) => {
  const { storedPin, storedName, myMarks, index } = req.body;
  const io = req.app.get('io');
  try {
    const runningIQuiz = await RunningIQuiz.findOne({ pin: storedPin });
    if (!runningIQuiz) {
      return res.status(404).json({ message: 'No IQuiz found!' });
    }
    const player = runningIQuiz.players.find((p) => p.name === storedName);
    if (!player) {
      return res.status(404).json({ message: 'Player not found!' });
    }
    // Ensure the scores array is long enough and set the score for this index
    while (player.scores.length <= index) {
      player.scores.push(0);
    }
    player.scores[index] = myMarks;
    runningIQuiz.markModified('players');
    await runningIQuiz.save();

    // Emit updated leaderboard to host
    io.to(`game:${storedPin}`).emit('leaderboard:update', runningIQuiz.players);

    return res.status(200).json({ scores: player.scores });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

// ─── Delete / stop a hosted game ──────────────────────────────────────────────
router.delete('/delete/:pin', async (req, res) => {
  const { pin } = req.params;
  const io = req.app.get('io');
  try {
    const deleted = await RunningIQuiz.findOneAndDelete({ pin });
    if (!deleted) {
      return res.status(404).json({ message: 'No IQuiz found with this pin!' });
    }
    // Tell all players the game ended
    io.to(`game:${pin}`).emit('game:ended');
    return res.status(200).json({ message: 'IQuiz stopped successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});

module.exports = router;