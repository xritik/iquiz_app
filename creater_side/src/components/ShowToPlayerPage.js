import React, { useEffect, useState } from 'react';
import  '../css/showToPlayer_page.css';

const ShowToPlayerPage = ({ navigate }) => {
    const storedPin = sessionStorage.getItem('playerPin');
    const storedName = sessionStorage.getItem('playerName');
    const [status, setStatus] = useState('notStarted');
    const [index, setIndex] = useState()
    const [timer, setTimer] = useState();
    const [selectedOption, setSelectedOption] = useState(null);

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
            setTimer(data.timer);
            setIndex(data.index);
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

    const handleSelectOption = (index) => {
        setSelectedOption(selectedOption===index ? null : index); // Set clicked option as selected
    };

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


                                <div className='myoptions'>
                                <div className='mytimer' style={{paddingLeft:'100px'}}>
                                    <span>{timer}</span>
                                </div>
                                    <div className='myoption'>
                                        {["Option1", "Option2", "Option3", "Option4"].map((option, index) => (
                                            <div 
                                                key={index} 
                                                className={selectedOption === index ? 'myoption2Active' : ''} 
                                                onClick={() => handleSelectOption(index)}
                                            >
                                                {option}
                                            </div>
                                        ))}
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