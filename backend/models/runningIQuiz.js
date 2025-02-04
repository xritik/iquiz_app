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
    shownQuestionId: {
        type: String
    },
    status: {
        type: String,
        default: 'Stop',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    }
});

const RunningIQuiz = mongoose.model('RunningIQuiz', runningIQuizSchema);
module.exports = RunningIQuiz;