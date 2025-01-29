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
        user: quizData.user,
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

router.post('/:id', async (req, res) => {
  try {
    const { quizData } = req.body;
    const { id } = req.params;

    const updatedIQuiz = await IQuiz.findByIdAndUpdate(
      id,
      { $set: quizData },
      { new: true, runValidators: true }
    );
    
    if (!updatedIQuiz) {
      return res.status(404).json({ message: 'IQuiz not found' });
    }
    
    res.status(200).json({ message: 'IQuiz updated successfully' });
    
  } catch (error) {
    console.error('Error saving quiz:', error);
    return res.status(500).json({ message: 'Internal server error!' });
  }
});

router.get('/:loggedinUser', async (req, res) => {
    const { loggedinUser } = req.params;

    try {
        const iquiz = await IQuiz.find({ user: loggedinUser });
        
        if (iquiz.length === 0) {
          return res.status(200).json([]);
        }

        res.status(200).json( iquiz );
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your saved IQuizzes!' });
    }
});

module.exports = router;