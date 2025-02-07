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
            scores: { type: [Number], default: [] },
        }
    ],
    // shownQuestion: {
    //     type: String,
    // },   `
    shownQuestionTimer: {
        type: Number
    },
    shownQuestionIndex: {
        type: Number
    },
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