import React, { useState, useEffect } from 'react'

const IQuizEditionPage = ({ hostName, navigate }) => {
    const loggedinUser = localStorage.getItem('IQuiz_loginName');
    const storedIQuiz = JSON.parse(localStorage.getItem('editingIQuiz')) || [];
    const [iquizTitle, setIquizTitle] = useState(storedIQuiz.title || '');
    const [iquizQuestions, setIquizQuestions] = useState(
        storedIQuiz?.questions?.length > 0
          ? storedIQuiz.questions
          : [
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
            ]
    );
      
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [errorsState, setErrorsState] = useState([]);
    const [crossClicked, setCrossClicked] = useState(false);
    
    useEffect(() => {
        if( !loggedinUser ){
        alert('Please login to get this page!')
        navigate('/login_signUp');
        }else{
            console.log(storedIQuiz);
        }
    });
    
    

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
    setCurrentQuestion(iquizQuestions.length);
    };

    const handleEdit = async () => {
    const validationErrors = iquizQuestions.map((q, questionIndex) => {
        const questionErrors = {
        question: q.question.trim() === '' ? 'Question text is empty' : null,
        timer: q.timer.trim() === '' ? 'Timer is empty' : null,
        option: q.options.some((option) => option.text.trim() === '' ) ? 'Option is empty' : null,
        currectOption: !q.options.some((option) => option.isCorrect) ? 'No correct option selected!' : null,
        };
        return questionErrors;
    });

    const filteredErrors = validationErrors.filter(
        (error) => error.question || error.timer || error.option  || error.currectOption
    );
    // setErrorsState(filteredErrors);
    // console.log(filteredErrors);

    setErrorsState(validationErrors);
    console.log(validationErrors);

    if (filteredErrors.length === 0) {
        setCrossClicked(false);
        const quizData = { user: loggedinUser, title: iquizTitle, questions: iquizQuestions };

        try{
            const response = await fetch(`http://${hostName}:5000/iquiz/${storedIQuiz._id}`, {
                method: 'POST',
                headers:{
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizData })
            });
                const data = await response.json();
        if(response.ok){
            console.log('Quiz Data:', quizData);
            localStorage.removeItem('editingIQuiz');
            alert(data.message);
            navigate('/home');
        }else if(response.status === 404){
            alert(data.message);
        }else if(response.status === 500){
            alert(data.message);
        } else{
            alert('Something went wrong, Please try again!!');
        }
        } catch (error) {
            console.error(error);
            alert('Something went wrong, Please try again!!');
        }
            // console.log('Quiz Data:', quizData);
            // alert('Quiz saved successfully!');
    }else{
        setCrossClicked(true);
    }
    };
    
    const handleDelete = (index) => {
    if(iquizQuestions.length > 1){
        const confirmation = window.confirm('Are you sure to delete this question?');
        if(confirmation){
            // const newArray = iquizQuestions.;
            setIquizQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
            // console.log(iquizQuestions);
            setCurrentQuestion( (currentQuestion > (iquizQuestions.length-2)) ? iquizQuestions.length-2 : currentQuestion )
        }
    }else{
        alert("You can't delete the last one question.")
    }
    };
    
    const handleClick = () => {
        setCrossClicked(false);
    };


    
  return (
    <div className="iquizCreationSection">
        <div className='popupSection' style={{display: `${ crossClicked ? 'flex' : 'none'}`}}>
            <div className='popupCard'>
                <i className='bx bx-x cross cross1' onClick={handleClick}></i>
                <h1>This IQuiz can't be edited!</h1>
                <p>All questions need to be completed before you can start editing.</p>
                {errorsState.map((items, i) =>{
                    if (
                        items.question === null &&
                        items.timer === null &&
                        items.option === null &&
                        items.currectOption === null
                    ) {
                        return null;
                    }
                    return(
                        <div className="emptySection" key={i}>
                            <div className="emptyQue_no">Q{i + 1}.</div>
                            <div className="emptyQuestions">
                                <ul>
                                    {items.question && <li>{items.question}</li>}
                                    {items.timer && <li>{items.timer}</li>}
                                    {items.option && <li>{items.option}</li>}
                                    {items.currectOption && <li>{items.currectOption}</li>}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      <div className="iquizCreationPart1">
        {iquizQuestions.map((quiz, index) => (
          <div key={index} className="questions">
            <div className='delIcon'>
                <i className='bx bxs-trash' onClick={() => handleDelete(index)} style={{color:`${currentQuestion===index ? 'red' : 'transparent'}`}}></i>
            </div>
            <div onClick={() => setCurrentQuestion(index)} className="question" style={{borderColor:`${currentQuestion===index ? '#0ef' : '#ccc'}`, color:`${currentQuestion===index ? '#0ef' : '#ccc'}`}}>
              <div className='mini_qNo'>
                Q{index + 1}.
                <div className='mini_timer'>{quiz.timer==='' ? 'T' : quiz.timer}</div>
              </div>
              <div className='mini_question'>{ quiz.question.trim().length===0 ? <div className='mini_box'></div> : (quiz.question.length > 18 ? quiz.question.slice(0, 18)+'...' : quiz.question) }</div>
              <div className='mini_options'>
                <div className='mini_option'>
                    {quiz.options[0].isCorrect && <div className='mini_correctOption'></div>}
                </div>
                <div className='mini_option'>
                    {quiz.options[1].isCorrect && <div className='mini_correctOption'></div>}
                </div>
              </div>
              <div className='mini_options'>
                <div className='mini_option'>
                    {quiz.options[2].isCorrect && <div className='mini_correctOption'></div>}
                </div>
                <div className='mini_option'>
                    {quiz.options[3].isCorrect && <div className='mini_correctOption'></div>}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div onClick={addEmptyQuestion} className="addMoreBtn">
          Add More
        </div>
      </div>

      <div className="iquizCreationPart2">
      <i className='bx bx-arrow-back back_arrow back_arrow1' onClick={() => {navigate('/'); localStorage.removeItem('editingIQuiz')}}></i>
        <form
          className="addingIQuizForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
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
              <button type="submit">Edit Quiz</button>
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
                        placeholder='Enter third option'
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
                        placeholder='Enter fourth option'
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
  )
}

export default IQuizEditionPage