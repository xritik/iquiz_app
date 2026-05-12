import React, { useEffect, useState } from 'react';
import '../css/leader_board.css';
import socket from '../socket';
import { BACKEND_URL } from '../App.js';

const LeaderBoard = ({ navigate }) => {
  const storedRunningIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
  const storedPin          = localStorage.getItem('gamePin');

  const [index, setIndex]     = useState(Number(sessionStorage.getItem('storedIndex')) || 0);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!storedPin) {
      sessionStorage.removeItem('runningIQuiz');
      sessionStorage.removeItem('storedIndex');
      sessionStorage.removeItem('time');
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storedPin) socket.emit('host:join', storedPin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storedPin) return;
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        if (response.ok) {
          setIndex(data.index ?? 0);
          setPlayers(data.players || []);
          if (data.status === 'Finished') localStorage.removeItem('gamePin');
        } else if (response.status === 400) {
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleLeaderboardUpdate = (updatedPlayers) => setPlayers([...updatedPlayers]);

    const handleGameEnded = () => {
      sessionStorage.removeItem('runningIQuiz');
      sessionStorage.removeItem('storedIndex');
      sessionStorage.removeItem('time');
      localStorage.removeItem('gamePin');
      navigate('/');
    };

    socket.on('leaderboard:update', handleLeaderboardUpdate);
    socket.on('game:ended', handleGameEnded);

    return () => {
      socket.off('leaderboard:update', handleLeaderboardUpdate);
      socket.off('game:ended', handleGameEnded);
    };
  }, [navigate]);

  const handleNext = async () => {
    const newIndex = index + 1;
    const newTime  = storedRunningIQuiz.questions[newIndex].timer;
    try {
      const response = await fetch(`${BACKEND_URL}/runningIQuiz/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: storedPin, status: 'Started', index: newIndex, timer: newTime }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('storedIndex', newIndex);
        sessionStorage.setItem('time', newTime);
        navigate('/question');
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again!');
    }
  };

  const handleHome = () => {
    localStorage.removeItem('gamePin');
    sessionStorage.removeItem('runningIQuiz');
    sessionStorage.removeItem('storedIndex');
    sessionStorage.removeItem('time');
    navigate('/');
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const sumA = a.scores.reduce((acc, s) => acc + s, 0);
    const sumB = b.scores.reduce((acc, s) => acc + s, 0);
    return sumB - sumA;
  });

  const totalQuestions = storedRunningIQuiz?.questions?.length || 0;

  return (
    <div className="leaderBoardSection">
      <h1>LeaderBoard</h1>
      <table className="leaderBoardTable">
        <thead>
          <tr><th>#</th><th>Player</th><th>Points</th></tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, i) => (
            <tr key={player._id || player.name}>
              <td>{i + 1}</td>
              <td>{player.name}</td>
              <td>{player.scores.reduce((acc, s) => acc + s, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalQuestions > index + 1 ? (
        <button onClick={handleNext} className="nextBtn" style={{ color: 'black' }}>Next</button>
      ) : (
        <button onClick={handleHome} className="nextBtn" style={{ color: 'black' }}>Home</button>
      )}
    </div>
  );
};

export default LeaderBoard;