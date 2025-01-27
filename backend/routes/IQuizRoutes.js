const express = require('express');
const router = express.Router();
const IQuiz = require('../models/iquiz');

router.post('/', async (req, res) => {
    try {
      const { quizData } = req.body;
  
      if (!quizData || !quizData.title || !quizData.questions || quizData.questions.length === 0) {
        return res.status(400).json({ message: 'Invalid quiz data!' });
      }
  
      const newQuiz = new IQuiz({
        title: quizData.title,
        questions: quizData.questions,
      });
  
      await newQuiz.save();
  
      return res.status(200).json({ message: 'Quiz added successfully!' });
    } catch (error) {
      console.error('Error saving quiz:', error);
      return res.status(500).json({ message: 'Internal server error!' });
    }
});

module.exports = router;