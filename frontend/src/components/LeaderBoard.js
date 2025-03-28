import React, { useEffect, useState } from 'react'

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
    <div>
        {players.map((player) => 
            <div key={player._id}>{player.name}:- {player.scores.reduce((acc, score) => acc + score, 0)}</div>
        )}
        {storedRunningIQuiz.questions.length>(index+1) ? 
            <button onClick={handleNext}>Next</button> : <div></div>    
        }
    </div>
  )
}

export default LeaderBoard