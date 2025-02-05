import React, { useEffect, useState } from 'react';
import  '../css/showToPlayer_page.css';

const ShowToPlayerPage = ({ navigate }) => {
    const storedPin = sessionStorage.getItem('playerPin');
    const storedName = sessionStorage.getItem('playerName');
    const [status, setStatus] = useState('notStarted');
    const [question, setQuestion] = useState({});

    useEffect(() => {
        if(!storedName && !storedPin){
            navigate('/')
        };
    },[ storedPin, storedName, status ]);

    const handleExit = () => {
        const confirmation = window.confirm('Are you sure to exit the game!');
        if(confirmation){
            sessionStorage.removeItem('playerPin');
            sessionStorage.removeItem('playerName');
            navigate('/');
        }
    };

    const getStatus = async () => {
        const response = await fetch(`http://localhost:5000/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        if(response.ok){
            setStatus(data.status);
            setQuestion(data.question[0]);
        }else if(response.status===400){
            sessionStorage.removeItem('playerPin');
            sessionStorage.removeItem('playerName');
            navigate('/');
        };
        // console.log(question);
    };

    useEffect(() => {
        if (!storedPin) return;
      
        const intervalId = setInterval(() => {
            getStatus();
        }, 500);
      
        return () => clearInterval(intervalId);
    }, [storedPin]);

  return (
    <div className='showToPlayerSection'>
      <i className='bx bxs-log-out back_arrow' onClick={handleExit}></i>
      {
        status === 'notStarted' ? <div className='shownStatus'>You are in the IQuiz, get ready for start!</div> :
        status === 'ShowingQuestion' ? <div className='shownStatus'>Get ready!</div>:
        status === 'Started' ? <>
                                {/* <div className='myshowQuestion'>
                                    <div className='myquestionNo'>1.</div>
                                    <div className='myquestion'>Choose the correct option for 3+4=?</div>
                                </div> */}

                                {/* <div className='mytimer'>
                                    <span>20</span>
                                </div> */}

                                <div className='myoptions'>
                                    <div className='myoption'>
                                        <div>Option1</div>
                                        <div>Option2</div>
                                        <div>Option1</div>
                                        <div>Option2</div>
                                    </div>
                                    {/* <div className='myoption'>
                                        <div>This is Option3</div>
                                        <div>Option4</div>
                                    </div> */}
                                </div>
                             </> :
        status === 'Loading' ? <div className='shownStatus'>Loading...</div>:
        status === 'Stop' ? <div className='shownStatus'>Your results</div>:
        status === 'Finish' ? <div className='shownStatus'>This IQuiz is finished!</div> : <div className='shownStatus'>Something went wrong!</div>
      }
    </div>
  )
}

export default ShowToPlayerPage;