import React, { useEffect, useState } from 'react'

const QuestionPage = ({ hostName, navigate }) => {
    const storedRunningIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
    const [index, setIndex] = useState( sessionStorage.getItem('storedIndex') || 0 );
    const [activeClass, setActiveClass] = useState('');
    const [timer, setTimer] = useState( sessionStorage.getItem('time') || storedRunningIQuiz.questions[index].timer );
    const [status, setStatus] = useState('Started');

    const storedPin = localStorage.getItem('gamePin');

    useState(() => {
        if(storedRunningIQuiz===null){
            sessionStorage.removeItem('runningIQuiz');
            sessionStorage.removeItem('storedIndex');
            sessionStorage.removeItem('time');
            localStorage.removeItem('gamePin');
            navigate('/');
        }
        if(!(sessionStorage.getItem('storedIndex'))){
            sessionStorage.setItem('storedIndex', 0);
        };
    }, [navigate]);

    const getStatus = async () => {
        const response = await fetch(`http://${hostName}:5000/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        if(data.status==='Answering'){
            sessionStorage.setItem('time', 0);
            setTimer(0);
        }
        
        if(response.ok){
            setStatus(data.status);
            setIndex(data.index);
        }else if(response.status===400){
            sessionStorage.removeItem('runningIQuiz');
            sessionStorage.removeItem('storedIndex');
            sessionStorage.removeItem('time');
            localStorage.removeItem('gamePin');
            navigate('/');
        };
    };

    useEffect(() => {
        if (!storedPin) return;
        
        const intervalId = setInterval(() => {
            getStatus();
        }, 500);
        
        return () => clearInterval(intervalId);
    }, [storedPin]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveClass('myoption2Active');
            console.log('first')
        }, (storedRunningIQuiz.questions[index].timer)*1000 + 2000 );
        return () => clearTimeout(timer);
    }, [ navigate ]);

    const changeStatus = async () => {
        const myStatus = storedRunningIQuiz.questions.length>(index+1) ? 'Answering' : 'Finished'
        try {
          const response = await fetch(`http://${hostName}:5000/runningIQuiz/statusAnswering`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pin: storedPin, status: 'Answering' })
          });
          const data = await response.json();
          if(response.ok){
            navigate('/leaderBoard');
          }else if(response.status===404){
            navigate('/');
            alert(data.message);
          }else if(response.status===500){
            navigate('/');
            alert(data.message);
          }else{
            alert('Something went wrong, Please try again1!');
          }
        } catch (error) {
          console.error(error);
          alert('Something went wrong, Please try again!');
        }
    };

    useEffect(() => {
        if (timer === 0){
            const timer = setTimeout(() => {
                changeStatus();
            }, 5000 );
            return () => clearTimeout(timer);
        };

        if(timer!=0){
            sessionStorage.setItem('time', timer);
        }

        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer])

    

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