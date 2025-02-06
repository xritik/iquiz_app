import React, { useEffect, useState } from 'react'

const QuestionPage = ({ navigate }) => {
    const storedRunningIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
    const [index, setIndex] = useState( sessionStorage.getItem('storedIndex') || 0 );
    const [activeClass, setActiveClass] = useState('');
    const [timer, setTimer] = useState(storedRunningIQuiz.questions[index].timer);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveClass('myoption2Active');
            console.log('first')
        }, (storedRunningIQuiz.questions[index].timer)*1000 + 2000 );
        return () => clearTimeout(timer);
    }, [ navigate ]);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer])

    

    if(storedRunningIQuiz===null){
        navigate('/');
    }
    if(!(sessionStorage.getItem('storedIndex'))){
        sessionStorage.setItem('storedIndex', 0);
    };
  return (
    <div className='showToPlayerSection'>

      <div className='myshowQuestion'>
        <div className='myquestionNo'>1.</div>
        <div className='myquestion'>{storedRunningIQuiz.questions[index].question}</div>
      </div>

      <div className='mytimer'>
        <span>{timer}</span>
      </div>

      <div className='myoptions2'>
        <div className='myoption2'>
          <div className={ storedRunningIQuiz.questions[index].options[0].isCorrect ? activeClass : '' }>{storedRunningIQuiz.questions[index].options[0].text}</div>
          <div className={ storedRunningIQuiz.questions[index].options[1].isCorrect ? activeClass : '' }>{storedRunningIQuiz.questions[index].options[1].text}</div>
        </div>
        <div className='myoption2'>
          <div className={ storedRunningIQuiz.questions[index].options[2].isCorrect ? activeClass : '' }>{storedRunningIQuiz.questions[index].options[2].text}</div>
          <div className={ storedRunningIQuiz.questions[index].options[3].isCorrect ? activeClass : '' }>{storedRunningIQuiz.questions[index].options[3].text}</div>
        </div>
      </div>

    </div>
  )
}

export default QuestionPage;