const mongoose = require('mongoose');

const iquizSchema = new mongoose.Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
    questions: [
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
});

const Iquiz = mongoose.model('Iquiz', iquizSchema);
module.exports = Iquiz;