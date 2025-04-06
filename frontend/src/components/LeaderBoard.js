import React, { useEffect, useState } from 'react';
import '../css/leader_board.css';
import {Link} from 'react-router-dom';

const LeaderBoard = ({ hostName, navigate }) => {
    const storedRunningIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
    const storedIndex = sessionStorage.getItem('storedIndex');
    const storedPin = localStorage.getItem('gamePin');
    const [status, setStatus] = useState();
    const [index, setIndex] = useState();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if(!storedPin){
            sessionStorage.removeItem('runningIQuiz');
            sessionStorage.removeItem('storedIndex');
            sessionStorage.removeItem('time');
            localStorage.removeItem('gamePin');
            navigate('/');
        }
    }, [ navigate, storedPin ]);

    const getStatus = async () => {
        const response = await fetch(`http://${hostName}:5000/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        
        if(response.ok){
            setStatus(data.status);
            setIndex(data.index);
            setPlayers(data.players);
        }else if(response.status===400){
            sessionStorage.removeItem('runningIQuiz');
            sessionStorage.removeItem('storedIndex');
            sessionStorage.removeItem('time');
            localStorage.removeItem('gamePin');
            navigate('/');
        };
    };

    const handleNext = async () => {
        const newIndex = index+1;
        const newTime = storedRunningIQuiz.questions[newIndex].timer;
        try {
            const response = await fetch(`http://${hostName}:5000/runningIQuiz/status`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pin: storedPin, status: 'Started', index: newIndex, timer: newTime })
            });
            const data = await response.json();
            if(response.ok){
                sessionStorage.setItem('storedIndex', newIndex);
                sessionStorage.setItem('time', newTime)
                navigate('/question');
            }else if(response.status===404){
                alert(data.message);
            }else if(response.status===500){
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
        if (!storedPin) return;
        
        const intervalId = setInterval(() => {
            getStatus();
        }, 500);
        
        return () => clearInterval(intervalId);
    }, [ storedPin, getStatus ]);

  return (
    <div className='leaderBoardSection'>
        <h1>LeaderBoard</h1>

        {players.map((player) => 
            <table className='leaderBoardTable'>
                <thead>
                    <th>Player</th>
                    <th>Points</th>
                    <th>Accuracy</th>
                </thead>
                <tbody>
                    <tr key={player._id}>
                        <td>{player.name}</td>
                        <td>{player.scores.reduce((acc, score) => acc + score, 0)}</td>
                        <td>100%</td>
                    </tr>
                </tbody>
            </table>
        )}

        {storedRunningIQuiz && storedRunningIQuiz.questions.length>(index+1) ? 
            <button className='nextBtn' style={{color:'black'}}>Next</button> : <Link className='nextBtn' style={{color:'black'}} to={'/home'}>Home</Link>
        }
    </div>
  )
}

export default LeaderBoard