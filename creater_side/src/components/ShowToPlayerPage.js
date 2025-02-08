import React, { useEffect, useState } from 'react';
import  '../css/showToPlayer_page.css';

const ShowToPlayerPage = ({ navigate }) => {
    const storedPin = sessionStorage.getItem('playerPin');
    const storedName = sessionStorage.getItem('playerName');
    const [status, setStatus] = useState('Loading');
    const [index, setIndex] = useState(null);
    const [timer, setTimer] = useState(null);
    const [time, setTime] = useState( null );
    const [startedIQuizId, setStartedIQuizId] = useState('');
    const [selectedOption, setSelectedOption] = useState( JSON.parse(sessionStorage.getItem('selectedOption')) || null);
    const [correctOptions, setCorrectOptions] = useState([]);
    const [marks, setMarks] = useState(sessionStorage.getItem('currentMarks') || '');

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
            sessionStorage.removeItem('selectedOption');
            sessionStorage.removeItem('time');
            sessionStorage.removeItem('currentMarks')
            navigate('/');
        }
    };

    const getStatus = async () => {
        const response = await fetch(`http://localhost:5000/runningIQuiz/status/${storedPin}`);
        const data = await response.json();
        if(data.status==='Answering'){
            sessionStorage.setItem('time', 0);
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
            sessionStorage.removeItem('currentMarks')
            navigate('/');
        };
        // console.log(question);
    };

    const handlemarks = async (myCorrectOptions) => {
        const myMarks = myCorrectOptions.includes(selectedOption) ? marks : 0;
        try{
            const response = await fetch('http://localhost:5000/runningIQuiz/setMarks',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ storedPin, storedName, myMarks, index })
            });
        }catch(error){
            console.error(error);
        }
    };

    const getCorrectOptions = async () => {
        try{
            const response = await fetch(`http://localhost:5000/iquiz/correctOptions/${startedIQuizId}/${index}`);
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
            alert('Somrthing went wrong');
        };
    };


    useEffect(() => {
        if(status==='Started'){
            setTime(timer);
        }else{
            setTime(sessionStorage.getItem('time'));
            setMarks(sessionStorage.getItem('currentMarks'));
        }
    }, [timer]);

    useEffect(() => {
        if(time==0 && (status==='Started' || status==='Answering')){
            getCorrectOptions();
        }
    }, [ time, status ]);


    useEffect(() => {
        if (time <= 0 || null) return;

        if(time!=0){
            sessionStorage.setItem('time', time);
        }

        const interval = setInterval(() => {
            setTime((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [ time ]);

    useEffect(() => {
        if (!storedPin) return;
      
        const intervalId = setInterval(() => {
            getStatus();
        }, 500);
      
        return () => clearInterval(intervalId);
    }, [storedPin]);

    const handleSelectOption = (index) => {
        setSelectedOption(selectedOption===index ? null : index);
        sessionStorage.setItem('selectedOption', JSON.stringify(selectedOption===index ? null : index));
        setMarks(500+(500*(time/timer)));
        sessionStorage.setItem('currentMarks', (500+(500*(time/timer))));
    };

  return (
    <div className='showToPlayerSection'>
      <i className='bx bxs-log-out back_arrow' onClick={handleExit}></i>
      {
        status === 'notStarted' ? <div className='shownStatus'>You are in the IQuiz, get ready for start!</div> :
        status === 'ShowingQuestion' ? <div className='shownStatus'>Get ready!</div>:
        status === 'Started' ? <>
                                    <div className='shownStatus' style={{display:`${time===0 ? 'block' : 'none'}`}}>Loading...</div>

                                    <div style={{display:`${time===0 ? 'none' : 'block'}`}}>
                                        <div className='myoptions'>
                                            <div className='mytimer' style={{paddingLeft:'100px'}}>
                                                <span>{time}</span>
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
                                        </div>
                                    </div>
                                </> :
        status === 'Loading' ? <div className='shownStatus'>Loading...</div>:
        status === ('Answering' || 'Finished') ?
                                <div style={{display:`${time==0 ? 'flex' : 'none'}`}}>
                                    <div className='myoptions2' style={{display:'flex', flexDirection:'column', gap:'80px', justifyContent:'center', alignItems:'center'}}>
                                        <div>
                                            <div style={{color:'#0ef', fontSize:'40px'}}>{correctOptions.includes(selectedOption) ? 'Correct Option Selected!' : 'Incorrect Option Selected!'}</div>
                                            <div style={{color:'#0ef', fontSize:'20px', fontWeight:'bold', marginTop:'10px'}}>Current Score:- <i>{correctOptions.includes(selectedOption) ? marks : 0}</i></div>
                                            <div style={{color:'#0ef', fontSize:'20px', fontWeight:'bold'}}>Total Score:- <i>1000</i></div>
                                        </div>
                                        <div className='myoption2'>
                                            {["Option1", "Option2", "Option3", "Option4"].map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={` ${selectedOption === index && !correctOptions.includes(index) ? 'incorrectOption' : ''}
                                                                ${correctOptions.includes(index) ? 'correctOption' : ''}`.trim()}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>:
        status === 'Finished' ? <div className='shownStatus'>This IQuiz is finished!</div> : <div className='shownStatus'>Something went wrong!</div>
      }
    </div>
  )
}

export default ShowToPlayerPage;