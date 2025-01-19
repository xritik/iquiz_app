import React, { useEffect, useState } from 'react'
import '../css/iquiz_creation_page.css'

const IQuizCreationPage = () => {
    const [iquiz, setIquiz] = useState({
        title: '',
        iquizQuestions: [],
    });
    const [iquizTitle, setIquizTitle] = useState('');
    const [iquizQuestions, setIquizQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: "",
        timer: "",
        // options: ["", "", "", ""],
        options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ],
    });

    const handleSave = () => {
        iquizQuestions.push(currentQuestion)
        console.log("Quiz Data:", iquiz);
        alert("Quiz saved! Check console for details.");
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...currentQuestion.options];
        updatedOptions[index].text = value;
        setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    };

    const handleSetCorrectOption = (index, value) => {
        const updatedOptions = [...currentQuestion.options];
        updatedOptions[index].isCorrect = !value;
        setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    }

    const addQuestion = () => {
        iquizQuestions.push(currentQuestion)
        setCurrentQuestion({
          question: "",
          timer: "",
        //   options: ["", "", "", ""], 
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
          ],
        });
        console.log("Quiz Data:", iquiz);
    };

    useEffect(() => {
        setIquiz({
            title: iquizTitle,
            iquizQuestions,
        });
    }, [ iquizTitle, iquizQuestions ] )
      
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
                            <option value={''}>Select time</option>
                            <option value={'10'}>10 second</option>
                            <option value={'20'}>20 second</option>
                            <option value={'30'}>30 second</option>
                        </select>
                    </div>
                </div>

                <div className='optionSection'>
                    <div className='options'>
                        <div className='option'>
                            <textarea 
                                required 
                                placeholder='Enter your first option'
                                value={currentQuestion.options[0].text}
                                onChange={(e) => handleOptionChange(0, e.target.value)}
                            />
                            <div className='selectOption'>
                                <i onClick={(e) => handleSetCorrectOption(0, currentQuestion.options[0].isCorrect)} className={`bx ${currentQuestion.options[0].isCorrect ? 'bxs-check-circle brightText' : 'bx-circle normalText' }`}></i>
                            </div>
                        </div>
                        <div className='option'>
                            <textarea 
                                required 
                                placeholder='Enter your second option'
                                value={currentQuestion.options[1].text}
                                onChange={(e) => handleOptionChange(1, e.target.value)}
                            />
                            <div className='selectOption'>
                                <i onClick={(e) => handleSetCorrectOption(1, currentQuestion.options[1].isCorrect)} className={`bx ${currentQuestion.options[1].isCorrect ? 'bxs-check-circle brightText' : 'bx-circle normalText' }`}></i>
                            </div>
                        </div>
                    </div>
                    <div className='options'>
                        <div className='option'>
                            <textarea 
                                required 
                                placeholder='Enter your third option'
                                value={currentQuestion.options[2].text}
                                onChange={(e) => handleOptionChange(2, e.target.value)}
                            />
                            <div className='selectOption'>
                                <i onClick={(e) => handleSetCorrectOption(2, currentQuestion.options[2].isCorrect)} className={`bx ${currentQuestion.options[2].isCorrect ? 'bxs-check-circle brightText' : 'bx-circle normalText' }`}></i>
                            </div>
                        </div>
                        <div className='option'>
                            <textarea 
                                required 
                                placeholder='Enter your fourth option'
                                value={currentQuestion.options[3].text}
                                onChange={(e) => handleOptionChange(3, e.target.value)}
                            />
                            <div className='selectOption'>
                                <i onClick={(e) => handleSetCorrectOption(3, currentQuestion.options[3].isCorrect)} className={`bx ${currentQuestion.options[3].isCorrect ? 'bxs-check-circle brightText' : 'bx-circle normalText' }`}></i>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    </div>
  )
}

export default IQuizCreationPage;