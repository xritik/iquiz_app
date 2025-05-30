import React, { useEffect, useState } from 'react';
import  '../css/showToPlayer_page.css';

const ShowToPlayerPage = ({ hostName, navigate }) => {
    const storedPin = sessionStorage.getItem('playerPin');
    const storedName = sessionStorage.getItem('playerName');
    const [status, setStatus] = useState('Loading');
    const savedMarks = sessionStorage.getItem('currentMarks');
    const [index, setIndex] = useState(null);
    const [timer, setTimer] = useState(null);
    const [time, setTime] = useState( null );
    const [startedIQuizId, setStartedIQuizId] = useState('');
    const [selectedOption, setSelectedOption] = useState( (sessionStorage.getItem('selectedOption')) || null);
    const [correctOptions, setCorrectOptions] = useState([]);
    const [marks, setMarks] = useState( savedMarks || '');
    const [myScores, setMyScores] = useState( JSON.parse(sessionStorage.getItem('myScores')) || [] ); 

    useEffect(() => {
        if(!storedName && !storedPin){
            navigate('/')
        };
    },[ storedPin, storedName, status, navigate ]);

    const handleExit = () => {
        const confirmation = window.confirm('Are you sure to exit the game!');
        if(confirmation){
            sessionStorage.removeItem('playerPin');
            sessionStorage.removeItem('playerName');
            sessionStorage.removeItem('selectedOption');
            sessionStorage.removeItem('time');
            sessionStorage.removeItem('currentMarks');
            sessionStorage.removeItem('storedIndex');
            navigate('/');
        }
    };

    const getStatus = async () => {
        const response = await fetch(`http://${hostName}:5000/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        if(data.status==='Answering'){
            sessionStorage.setItem('time', 0);
        }
        if(data.timer==(sessionStorage.getItem('time'))){
            sessionStorage.removeItem('selectedOption');
            sessionStorage.removeItem('currentMarks');
            setSelectedOption(null);
        }
        
        if(response.ok){
            setStatus(data.status);
            setTimer(data.timer);
            setIndex(data.index);
            setStartedIQuizId(data.id);
        }else if(response.status===400){
            sessionStorage.removeItem('playerPin');
            sessionStorage.removeItem('playerName');
            sessionStorage.removeItem('selectedOption');
            sessionStorage.removeItem('time');
            sessionStorage.removeItem('currentMarks');
            sessionStorage.removeItem('storedIndex');
            navigate('/');
        };
        // console.log(question);
    };

    useEffect(() => {
        if(time==0){
            if(correctOptions.includes(Number(selectedOption))){
                setMarks(savedMarks);
            }else{
                setMarks(0);
            }
        };
    }, [ time, correctOptions ]);

    const handlemarks = async (myCorrectOptions) => {
        const myMarks = myCorrectOptions.includes(Number(selectedOption)) ? savedMarks : 0;
        try{
            const response = await fetch(`http://${hostName}:5000/runningIQuiz/setMarks`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ storedPin, storedName, myMarks, index })
            });
            const data = await response.json();
            if(response.ok){
                setMyScores(data.scores);
                // sessionStorage.setItem('myScores', JSON.stringify(data.scores));
            };
        }catch(error){
            console.error(error);
        }
    };

    const getCorrectOptions = async () => {
        try{
            const response = await fetch(`http://${hostName}:5000/iquiz/correctOptions/${startedIQuizId}/${index}`);
            const data = await response.json();
            // console.log(data.correctOptions);
            if(response.ok){
                setCorrectOptions(data.correctOptions);
                handlemarks(data.correctOptions);
            }else if(response.status===404){
                alert(data.message);
            }else if(response.status===500){
                alert(data.message);
            }else{
                alert('Something went wrong');
            }
        }catch (error) {
            console.error(error);
            alert('Something went wrong');
        };
    };

    useEffect(() => {
        if(status==='Started'){
            setTime(timer);
        }else{
            setTime(Number(sessionStorage.getItem('time')));
            setMarks(Number(sessionStorage.getItem('currentMarks')));
        }

        if((time==0) && (status==='Answering')){
            getCorrectOptions();
        }
    }, [timer, status]);


    useEffect(() => {
        if (time <= 0 || null) return;

        if(time!==0){
            sessionStorage.setItem('time', time);
        }

        const interval = setInterval(() => {
            setTime((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [ time ]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (storedPin) {
                getStatus();
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    

    const handleSelectOption = (index) => {
        setSelectedOption(selectedOption===index ? null : index);
        sessionStorage.setItem('selectedOption', JSON.stringify(selectedOption===index ? null : index));
        setMarks(500+(500*(time/timer)));
        sessionStorage.setItem('currentMarks', (500+(500*(time/timer))));
    };

    const handleHome = () => {
        localStorage.removeItem('gamePin');
        sessionStorage.removeItem('runningIQuiz');
        sessionStorage.removeItem('storedIndex');
        sessionStorage.removeItem('time');
        navigate('/');
    };

  return (
    <div className='showToPlayerSection'>
      <i className='bx bxs-log-out back_arrow' onClick={handleExit}></i>
      {
        status === 'notStarted' ? <div className='shownStatus'>You are in the IQuiz, get ready for start!</div> :
        status === 'ShowingQuestion' ? <div className='shownStatus'>Get ready!</div>:
        status === 'Started' ? <>
                                    <div className='shownStatus' style={{display:`${time==0 ? 'block' : 'none'}`}}>Loading...</div>

                                    <div style={{display:`${time==0 ? 'none' : 'block'}`}}>
                                        <div className='myoptions'>
                                            <div className='mytimer' style={{paddingLeft:'100px'}}>
                                                <span>{time}</span>
                                            </div>
                                            <div className='myoption'>
                                                {["Option1", "Option2", "Option3", "Option4"].map((option, index) => (
                                                    <div 
                                                        key={index} 
                                                        className={selectedOption == index ? 'myoption2Active' : ''} 
                                                        onClick={() => handleSelectOption(index)}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </> :
        status === 'Loading' ? <div className='shownStatus'>Loading...</div>:
        ['Answering', 'Finished'].includes(status) ? 
                                <div style={{display:`${time==0 ? 'flex' : 'none'}`}}>
                                    <div className='myoptions2' style={{display:'flex', flexDirection:'column', gap:'80px', justifyContent:'center', alignItems:'center'}}>
                                        <div>
                                            <div className='resultT1'>{selectedOption ? (correctOptions.includes(Number(selectedOption)) ? 'Correct Option Selected!' : 'Incorrect Option Selected!') : 'No Option Selected!'}</div>
                                            <div className='resultT2' style={{marginTop:'10px'}}>Current Score:- <i>{correctOptions.includes(Number(selectedOption)) ? marks : 0}</i></div>
                                            <div className='resultT3'>Total Score:- <i>{myScores.reduce((acc, score) => acc + score, 0)}/{myScores.length}</i></div>
                                        </div>
                                        <div className='myoption2'>
                                            {["Option1", "Option2", "Option3", "Option4"].map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={` ${selectedOption == index && !correctOptions.includes(index) ? 'incorrectOption' : ''}
                                                                ${correctOptions.includes(index) ? 'correctOption' : ''}`.trim()}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    { status==='Finished' && <button onClick={handleHome} className='nextBtn' style={{color:'black'}}>Home</button>}
                                    </div>
                                </div> :  <div className='shownStatus'>Something went wrong!</div>

        // status === 'Finished' ? <div className='shownStatus'>This IQuiz is finished!</div> : <div className='shownStatus'>Something went wrong!</div>
      }
    </div>
  )
}

export default ShowToPlayerPage;