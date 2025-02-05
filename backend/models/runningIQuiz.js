const mongoose = require('mongoose');

const runningIQuizSchema = new mongoose.Schema({
    hoster: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    iquizId: {
        type: String,
        required: true,
    },
    players: [
        {
            name: { type: String },
            answers: { type: [Boolean], default: [] },
        }
    ],
    shownQuestion:[
        {
          question: { type: String, required: true },
          timer: { type: String, required: true },
          options: [
            {
              text: { type: String, required: true },
              isCorrect: { type: Boolean, required: true },
            },
          ],
        },
    ],
    status: {
        type: String,
        default: 'notStarted',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7200,
    }
});

const RunningIQuiz = mongoose.model('RunningIQuiz', runningIQuizSchema);
module.exports = RunningIQuiz;