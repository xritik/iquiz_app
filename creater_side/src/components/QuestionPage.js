import React from 'react'

const QuestionPage = ({ navigate }) => {
    const storedRunningIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
    console.log(storedRunningIQuiz);

    if(!storedRunningIQuiz){
        navigate('/');
    }
  return (
    <div className='showToPlayerSection'>

      <div className='myshowQuestion'>
        <div className='myquestionNo'>1.</div>
        <div className='myquestion'>{storedRunningIQuiz.questions[0].question}</div>
      </div>

      <div className='mytimer'>
        <span>20</span>
      </div>

      <div className='myoptions2'>
        <div className='myoption'>
          <div>{storedRunningIQuiz.questions[0].options[0].text}</div>
          <div>{storedRunningIQuiz.questions[0].options[1].text}</div>
        </div>
        <div className='myoption'>
          <div>{storedRunningIQuiz.questions[0].options[2].text}</div>
          <div>{storedRunningIQuiz.questions[0].options[3].text}</div>
        </div>
      </div>

    </div>
  )
}

export default QuestionPage;