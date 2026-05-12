import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../css/showToPlayer_page.css';
import socket from '../socket';
import { BACKEND_URL } from '../App.js';

const ShowToPlayerPage = ({ navigate }) => {
  const storedPin  = sessionStorage.getItem('playerPin');
  const storedName = sessionStorage.getItem('playerName');

  const [status, setStatus]                 = useState('Loading');
  const [timer, setTimer]                   = useState(null);
  const [time, setTime]                     = useState(null);
  const [selectedOption, setSelectedOption] = useState(
    sessionStorage.getItem('selectedOption') !== '' &&
    sessionStorage.getItem('selectedOption') != null
      ? Number(sessionStorage.getItem('selectedOption'))
      : null
  );
  const [correctOptions, setCorrectOptions] = useState([]);
  const [marks, setMarks]                   = useState(
    Number(sessionStorage.getItem('currentMarks')) || 0
  );
  const [myScores, setMyScores]             = useState(
    JSON.parse(sessionStorage.getItem('myScores')) || []
  );

  const selectedOptionRef = useRef(selectedOption);
  const marksRef          = useRef(Number(sessionStorage.getItem('currentMarks')) || 0);
  const timerRef          = useRef(timer);

  useEffect(() => { selectedOptionRef.current = selectedOption; }, [selectedOption]);
  useEffect(() => { marksRef.current = marks; }, [marks]);
  useEffect(() => { timerRef.current = timer; }, [timer]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem('playerPin');
    sessionStorage.removeItem('playerName');
    sessionStorage.removeItem('selectedOption');
    sessionStorage.removeItem('time');
    sessionStorage.removeItem('currentMarks');
    sessionStorage.removeItem('storedIndex');
    sessionStorage.removeItem('myScores');
  }, []);

  useEffect(() => {
    if (!storedName || !storedPin) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storedPin) socket.emit('player:join', storedPin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitMarks = useCallback(async (correctOpts, selOption, earnedMarks, qIndex) => {
    const myMarks = correctOpts.includes(Number(selOption)) ? earnedMarks : 0;
    try {
      const response = await fetch(`${BACKEND_URL}/runningIQuiz/setMarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storedPin, storedName, myMarks, index: qIndex }),
      });
      const data = await response.json();
      if (response.ok) {
        setMyScores(data.scores);
        sessionStorage.setItem('myScores', JSON.stringify(data.scores));
      }
    } catch (error) {
      console.error(error);
    }
  }, [storedPin, storedName]);

  const getCorrectOptions = useCallback(async (iquizId, qIndex) => {
    try {
      const response = await fetch(`${BACKEND_URL}/iquiz/correctOptions/${iquizId}/${qIndex}`);
      const data = await response.json();
      if (response.ok) {
        setCorrectOptions(data.correctOptions);
        return data.correctOptions;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  }, []);

  useEffect(() => {
    const handleStatusUpdate = async (data) => {
      const { status: newStatus, index: newIndex, timer: newTimer, id } = data;
      setStatus(newStatus);

      if (newStatus === 'Started') {
        const prevIndex = sessionStorage.getItem('storedIndex');
        if (String(newIndex) !== String(prevIndex)) {
          setSelectedOption(null);
          selectedOptionRef.current = null;
          setMarks(0);
          marksRef.current = 0;
          setCorrectOptions([]);
          sessionStorage.removeItem('selectedOption');
          sessionStorage.removeItem('currentMarks');
          sessionStorage.setItem('storedIndex', newIndex);
        }
        const t = Number(newTimer);
        setTimer(t);
        timerRef.current = t;
        setTime(t);
        sessionStorage.setItem('time', t);
      }

      if (newStatus === 'Answering' || newStatus === 'Finished') {
        setTime(0);
        sessionStorage.setItem('time', 0);
        const opts = await getCorrectOptions(id, newIndex);
        await submitMarks(opts, selectedOptionRef.current, marksRef.current, newIndex);
      }
    };

    const handleGameEnded = () => {
      clearSession();
      navigate('/');
    };

    socket.on('game:statusUpdate', handleStatusUpdate);
    socket.on('game:ended', handleGameEnded);

    return () => {
      socket.off('game:statusUpdate', handleStatusUpdate);
      socket.off('game:ended', handleGameEnded);
    };
  }, [navigate, getCorrectOptions, submitMarks, clearSession]);

  useEffect(() => {
    if (!storedPin) return;
    const fetchInitialStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        if (response.ok) {
          setStatus(data.status);
          const t = Number(data.timer);
          setTimer(t);
          timerRef.current = t;

          if (data.status === 'Started') {
            const savedTime = Number(sessionStorage.getItem('time'));
            setTime(savedTime > 0 ? savedTime : t);
          } else if (['Answering', 'Finished'].includes(data.status)) {
            setTime(0);
            getCorrectOptions(data.id, data.index);
          }
        } else if (response.status === 400) {
          clearSession();
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitialStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (time === null || time <= 0) return;
    sessionStorage.setItem('time', time);
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const handleSelectOption = (optionIndex) => {
    if (time === 0 || status !== 'Started') return;
    const newSelection = selectedOption === optionIndex ? null : optionIndex;
    setSelectedOption(newSelection);
    selectedOptionRef.current = newSelection;
    sessionStorage.setItem('selectedOption', newSelection === null ? '' : String(newSelection));
    const earned = Math.round(500 + 500 * (time / timerRef.current));
    setMarks(earned);
    marksRef.current = earned;
    sessionStorage.setItem('currentMarks', earned);
  };

  const handleExit = () => {
    if (!window.confirm('Are you sure to exit the game!')) return;
    clearSession();
    navigate('/');
  };

  const handleHome = () => {
    clearSession();
    navigate('/');
  };

  const totalScore = myScores.reduce((acc, s) => acc + s, 0);
  const isCorrect  = correctOptions.includes(Number(selectedOption));

  return (
    <div className="showToPlayerSection">
      <i className="bx bxs-log-out back_arrow" onClick={handleExit}></i>

      {status === 'notStarted' && <div className="shownStatus">You are in the IQuiz, get ready for start!</div>}
      {status === 'ShowingQuestion' && <div className="shownStatus">Get ready!</div>}
      {status === 'Loading' && <div className="shownStatus">Loading...</div>}

      {status === 'Started' && (
        time === 0 ? <div className="shownStatus">Loading...</div> : (
          <div>
            <div className="myoptions">
              <div className="mytimer" style={{ paddingLeft: '100px' }}><span>{time}</span></div>
              <div className="myoption">
                {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((label, i) => (
                  <div key={i} className={selectedOption === i ? 'myoption2Active' : ''} onClick={() => handleSelectOption(i)}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {['Answering', 'Finished'].includes(status) && time === 0 && (
        <div style={{ display: 'flex' }}>
          <div className="myoptions2" style={{ display: 'flex', flexDirection: 'column', gap: '80px', justifyContent: 'center', alignItems: 'center' }}>
            <div>
              <div className="resultT1">
                {selectedOption === null ? 'No Option Selected!' : isCorrect ? 'Correct Option Selected!' : 'Incorrect Option Selected!'}
              </div>
              <div className="resultT2" style={{ marginTop: '10px' }}>Current Score:- <i>{isCorrect ? marks : 0}</i></div>
              <div className="resultT3">Total Score:- <i>{totalScore}</i></div>
            </div>
            <div className="myoption2">
              {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((label, i) => (
                <div key={i} className={`${selectedOption === i && !correctOptions.includes(i) ? 'incorrectOption' : ''} ${correctOptions.includes(i) ? 'correctOption' : ''}`.trim()}>
                  {label}
                </div>
              ))}
            </div>
            {status === 'Finished' && <button onClick={handleHome} className="nextBtn" style={{ color: 'black' }}>Home</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowToPlayerPage;