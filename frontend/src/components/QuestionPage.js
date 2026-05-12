import React, { useEffect, useState, useCallback, useRef } from 'react';
import socket from '../socket';
import { BACKEND_URL } from '../App.js';

const QuestionPage = ({ navigate }) => {
  const storedRunningIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
  const storedPin          = localStorage.getItem('gamePin');

  const initialIndex = Number(sessionStorage.getItem('storedIndex')) || 0;
  const initialTime  = Number(sessionStorage.getItem('time')) ||
                       storedRunningIQuiz?.questions[initialIndex]?.timer || 30;

  const [index, setIndex]           = useState(initialIndex);
  const [activeClass, setActiveClass] = useState('');
  const [timer, setTimer]           = useState(initialTime);

  const indexRef = useRef(index);
  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    if (!storedRunningIQuiz || !storedPin) {
      sessionStorage.removeItem('runningIQuiz');
      sessionStorage.removeItem('storedIndex');
      sessionStorage.removeItem('time');
      localStorage.removeItem('gamePin');
      navigate('/');
      return;
    }
    if (!sessionStorage.getItem('storedIndex')) sessionStorage.setItem('storedIndex', 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storedPin) socket.emit('host:join', storedPin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = useCallback(async () => {
    if (!storedRunningIQuiz) return;
    const currentIndex = indexRef.current;
    const myStatus = storedRunningIQuiz.questions.length > currentIndex + 1 ? 'Answering' : 'Finished';
    try {
      const response = await fetch(`${BACKEND_URL}/runningIQuiz/statusAnswering`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: storedPin, status: myStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/leaderBoard');
      } else {
        alert(data.message || 'Something went wrong!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, storedPin]);

  useEffect(() => {
    if (!storedRunningIQuiz) return;
    const questionTimer = storedRunningIQuiz.questions[index]?.timer || 30;
    const t = setTimeout(() => setActiveClass('myoption2Active'), questionTimer * 1000 + 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (timer === 0) {
      const t = setTimeout(() => changeStatus(), 5000);
      return () => clearTimeout(t);
    }
    sessionStorage.setItem('time', timer);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, changeStatus]);

  useEffect(() => {
    const handleStatusUpdate = (data) => {
      if (data.status === 'Answering') {
        setTimer(0);
        sessionStorage.setItem('time', 0);
      }
      if (data.index !== undefined) setIndex(data.index);
    };
    socket.on('game:statusUpdate', handleStatusUpdate);
    return () => socket.off('game:statusUpdate', handleStatusUpdate);
  }, []);

  if (!storedRunningIQuiz) return null;

  const currentQuestion = storedRunningIQuiz.questions[index];

  return (
    <div className="showToPlayerSection">
      <div className="myshowQuestion">
        <div className="myquestionNo">{index + 1}.</div>
        <div className="myquestion">{currentQuestion.question}</div>
      </div>
      <div className="mytimer"><span>{timer}</span></div>
      <div className="myoptions2">
        <div className="myoption2">
          <div className={currentQuestion.options[0].isCorrect ? activeClass : ''}>{currentQuestion.options[0].text}</div>
          <div className={currentQuestion.options[1].isCorrect ? activeClass : ''}>{currentQuestion.options[1].text}</div>
        </div>
        <div className="myoption2">
          <div className={currentQuestion.options[2].isCorrect ? activeClass : ''}>{currentQuestion.options[2].text}</div>
          <div className={currentQuestion.options[3].isCorrect ? activeClass : ''}>{currentQuestion.options[3].text}</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;