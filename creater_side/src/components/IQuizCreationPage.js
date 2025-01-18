import React, { useState } from 'react'
import '../css/iquiz_creation_page.css'

const IQuizCreationPage = () => {
    const [iquiz, setIquiz] = useState([]);
    const [iquizTitle, setIquizTitle] = useState('');
    const [iquizQuestions, setIquizQuestions] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState({
        question: "",
        timer: "",
        options: ["", "", "", ""],
        // options: [
        //     { text: "", isCorrect: false },
        //     { text: "", isCorrect: false },
        //     { text: "", isCorrect: false },
        //     { text: "", isCorrect: false }
        // ],
    });

    const handleSave = () => {
        setIquizQuestions([...iquizQuestions, currentQuestion]);
        const quiz = {
            title: iquizTitle,
            iquizQuestions,
        };
        console.log("Quiz Data:", quiz);
        alert("Quiz saved! Check console for details.");
        // Reset form
        setIquizTitle("");
        setIquizQuestions([]);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...currentQuestion.options];
        updatedOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    };

    const addQuestion = () => {
        setIquizQuestions([...iquizQuestions, currentQuestion]);
        setCurrentQuestion({
          question: "",
          timer: "",
          options: ["", "", "", ""], 
          // options: [
          //     { text: "", isCorrect: false },
          //     { text: "", isCorrect: false },
          //     { text: "", isCorrect: false },
          //     { text: "", isCorrect: false }
          // ],
        });
        const quiz = {
            title: iquizTitle,
            iquizQuestions,
        };
        console.log("Quiz Data:", quiz);
    };

  return (
    <div className='iquizCreationSection'>
        <div className='iquizCreationPart1'>
            <div className='questions'>Question 1</div>
            <div className='questions'>Question 2</div>
            <div className='questions'>Question 3</div>
            <div className='addMoreBtn' onClick={addQuestion}>Add more</div>
        </div>
        <div className='iquizCreationPart2'>
            <form className='addingIQuizForm' onSubmit={(e) => {e.preventDefault(); handleSave()}}>
                <div className='title_button'>
                    {/* <div className='part1'></div> */}
                    <div className='part1'>
                        <input
                            type='text'
                            required
                            placeholder='Title for your IQuiz'
                            value={iquizTitle}
                            onChange={(e) => setIquizTitle(e.target.value)}
                        />
                    </div>
                    <div className='part2'>
                        <button>Save</button>
                    </div>
                </div>
                <div className='question_timer'>
                    <div className='part1'>1</div>
                    <div className='part2'>
                        <textarea
                            type='text'
                            required
                            placeholder='Type your question'
                            value={currentQuestion.question}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        />
                    </div>
                    <div className='part3'>
                        <select value={currentQuestion.timer} onChange={(e) => setCurrentQuestion({ ...currentQuestion, timer: e.target.value })}>
                            <option value={'10'}>10 second</option>
                            <option value={'20'}>20 second</option>
                            <option value={'30'}>30 second</option>
                        </select>
                    </div>
                </div>

                <div className='options'>
                    <div className='option'>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your first option'
                                value={currentQuestion.options[0]}
                                onChange={(e) => handleOptionChange(0, e.target.value)}
                            />
                        </div>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your second option'
                                value={currentQuestion.options[1]}
                                onChange={(e) => handleOptionChange(1, e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='option'>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your third option'
                                value={currentQuestion.options[2]}
                                onChange={(e) => handleOptionChange(2, e.target.value)}
                            />
                        </div>
                        <div>
                            <textarea 
                                required 
                                placeholder='Enter your fourth option'
                                value={currentQuestion.options[3]}
                                onChange={(e) => handleOptionChange(3, e.target.value)}
                            />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    </div>
  )
}

export default IQuizCreationPage;