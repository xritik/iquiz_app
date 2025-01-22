import React, { useState } from 'react';
import '../css/iquiz_creation_page.css'

const QuizCreation = () => {
  const [iquizTitle, setIquizTitle] = useState('');
  const [iquizQuestions, setIquizQuestions] = useState([
    {
      question: '',
      timer: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  console.log(iquizQuestions);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...iquizQuestions];
    updatedQuestions[index].question = value;
    setIquizQuestions(updatedQuestions);
  };

  const handleTimerChange = (index, value) => {
    const updatedQuestions = [...iquizQuestions];
    updatedQuestions[index].timer = value;
    setIquizQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, Index, value) => {
    const updatedQuestions = [...iquizQuestions];
    updatedQuestions[Index].options[index].text = value;
    setIquizQuestions(updatedQuestions);
  };

  const handleSetCorrectOption = (index, Index) => {
    const updatedQuestions = [...iquizQuestions];
    updatedQuestions[Index].options[index].isCorrect = !(updatedQuestions[Index].options[index].isCorrect)
    setIquizQuestions(updatedQuestions);
  };

  const addEmptyQuestion = () => {
    const newQuestion = {
      question: '',
      timer: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    };
    setIquizQuestions([...iquizQuestions, newQuestion]);
    setCurrentQuestion(iquizQuestions.length); // Focus on the new question
  };

  const handleSave = () => {
    const quizData = { title: iquizTitle, questions: iquizQuestions };
    console.log(quizData);
    alert('Quiz saved successfully!');
  };

  return (
    <div className="iquizCreationSection">
      <div className="iquizCreationPart1">
        {iquizQuestions.map((quiz, index) => (
          <div key={index} className="questions">
            <div onClick={() => setCurrentQuestion(index)} className="question">
              Question {index + 1}
            </div>
          </div>
        ))}
        <div onClick={addEmptyQuestion} className="addMoreBtn">
          Add More
        </div>
      </div>

      <div className="iquizCreationPart2">
        <form
          className="addingIQuizForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="title_button">
            <div className="part1">
              <input
                type="text"
                required
                placeholder="Title for your IQuiz"
                value={iquizTitle}
                onChange={(e) => setIquizTitle(e.target.value)}
              />
            </div>
            <div className="part2">
              <button type="submit">Save Quiz</button>
            </div>
          </div>

          {currentQuestion !== null && (
            <div>
              <div className="question_timer">
                <div className="part1">Q{currentQuestion + 1}</div>
                <div className="part2">
                  <textarea
                    type="text"
                    required
                    placeholder="Type your question"
                    value={iquizQuestions[currentQuestion].question}
                    onChange={(e) => handleQuestionChange(currentQuestion, e.target.value)}
                  />
                </div>
                <div className="part3">
                  <select
                    value={iquizQuestions[currentQuestion].timer}
                    onChange={(e) => handleTimerChange(currentQuestion, e.target.value)}
                  >
                    <option value="">Select time</option>
                    <option value="10">10 seconds</option>
                    <option value="20">20 seconds</option>
                    <option value="30">30 seconds</option>
                  </select>
                </div>
              </div>

              <div className="optionSection">
                <div className="options">
                    <div className="option">
                      <textarea
                        required
                        placeholder='Enter first option'
                        value={iquizQuestions[currentQuestion].options[0].text}
                        onChange={(e) => handleOptionChange(0, currentQuestion, e.target.value)}
                      />
                      <div className="selectOption">
                        <i
                          onClick={() => handleSetCorrectOption(0, currentQuestion)}
                          className={`bx ${
                            iquizQuestions[currentQuestion].options[0].isCorrect
                              ? 'bxs-check-circle brightText'
                              : 'bx-circle normalText'
                          }`}
                        ></i>
                      </div>
                    </div>

                    <div className="option">
                      <textarea
                        required
                        placeholder='Enter second option'
                        value={iquizQuestions[currentQuestion].options[1].text}
                        onChange={(e) => handleOptionChange(1, currentQuestion, e.target.value)}
                      />
                      <div className="selectOption">
                        <i
                          onClick={() => handleSetCorrectOption(1, currentQuestion)}
                          className={`bx ${
                            iquizQuestions[currentQuestion].options[1].isCorrect
                              ? 'bxs-check-circle brightText'
                              : 'bx-circle normalText'
                          }`}
                        ></i>
                      </div>
                    </div>
                </div>

                <div className="options">
                    <div className="option">
                      <textarea
                        required
                        placeholder='Enter first option'
                        value={iquizQuestions[currentQuestion].options[2].text}
                        onChange={(e) => handleOptionChange(2, currentQuestion, e.target.value)}
                      />
                      <div className="selectOption">
                        <i
                          onClick={() => handleSetCorrectOption(2, currentQuestion)}
                          className={`bx ${
                            iquizQuestions[currentQuestion].options[2].isCorrect
                              ? 'bxs-check-circle brightText'
                              : 'bx-circle normalText'
                          }`}
                        ></i>
                      </div>
                    </div>

                    <div className="option">
                      <textarea
                        required
                        placeholder='Enter second option'
                        value={iquizQuestions[currentQuestion].options[3].text}
                        onChange={(e) => handleOptionChange(3, currentQuestion, e.target.value)}
                      />
                      <div className="selectOption">
                        <i
                          onClick={() => handleSetCorrectOption(3, currentQuestion)}
                          className={`bx ${
                            iquizQuestions[currentQuestion].options[3].isCorrect
                              ? 'bxs-check-circle brightText'
                              : 'bx-circle normalText'
                          }`}
                        ></i>
                      </div>
                    </div>
                </div>

              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuizCreation;
