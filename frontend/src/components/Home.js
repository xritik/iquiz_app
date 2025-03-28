import React, { useEffect, useState } from 'react'

const Home = ({ hostName, navigate, setShowSignUp }) => {

  const loggedinUser = localStorage.getItem('IQuiz_loginName')
  const [isProfileCard, setIsProfileCard] = useState(false);
  const [iquizzes, setIquizzes] = useState([]);
  const [crossClicked, setCrossClicked] = useState(false);
  const [iquizPin, setIQuizPin] = useState(localStorage.getItem('gamePin') || '');
  const [playerPin, setPlayerPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const storedPin = localStorage.getItem('gamePin');
  // console.log(iquizzes)

  // const handleJoinGame = async() => {
  //   window.open('http://localhost:3001/');
  //   try {
  //     const response = await fetch(`http://${hostName}:5000/start-game`, {
  //       method: 'POST',
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       alert(result.message);
  //       navigate('http://localhost:3001/');
  //     } else {
  //       alert('Failed to start IQuiz!');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Error starting IQuiz!');
  //   }
  // }

  const showProfileCard = () => {
    setIsProfileCard(true);
  }
  const hideProfileCard = () => {
    setIsProfileCard(false);
  }

  const handleLogout = () => {
    localStorage.removeItem('IQuiz_loginName');
    localStorage.removeItem('editingIQuiz');
    window.location.reload();
  }

  const fetchIQuizzes = async () => {
    try {
      const response = await fetch(`http://${hostName}:5000/iquiz/${loggedinUser}`);
      const data = await response.json();
      if(response.ok){
        setIquizzes(data);
      }else if(response.status === 500){
        alert(data.message);
      }else{
        alert('Something went wrong, Please try again!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong, Please try again!!');
    }
  };

  useEffect(() => {
    if(loggedinUser){
      fetchIQuizzes();
    };
    if(storedPin){
      setCrossClicked(true);
    }
  }, [ navigate ] );

  const handleEdit = (iquiz) => {
    localStorage.setItem('editingIQuiz', JSON.stringify(iquiz));
    navigate('/editing_iquiz')
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm('Are you sure to Delete this IQuiz?');

    if(confirmation){
      try {
        const response = await fetch(`http://${hostName}:5000/iquiz/${id}`,{
          method: 'DELETE'
        });
        const data = await response.json();
        if(response.ok){
          fetchIQuizzes();
          alert(data.message);
        }else if(response.status === 404){
          alert(data.message);
        }else if(response.status === 500){
          alert(data.message);
        } else{
          alert('Failed to delete IQuiz!');
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Something went wrong, Please try again!!'); 
      }
    }
  };

  const handleCross = async (pin) => {
    const confirmation = window.confirm('Are you sure to stop hosting of this IQuiz?');
    if(confirmation){
      try {
        const response = await fetch(`http://${hostName}:5000/runningIQuiz/delete/${pin}`,{
          method: 'DELETE'
        });
        const data = await response.json();
        if(response.ok){
          setCrossClicked(false);
          localStorage.removeItem('gamePin');
          sessionStorage.removeItem('runningIQuiz');
          alert(data.message);
        }else if(response.status===404){
          alert(data.message);
          setCrossClicked(false);
          localStorage.removeItem('gamePin');
        }else if(response.status===500){
          alert(data.message);
        }else{
          alert('Something went wrong, Please try again!!');
        }
      } catch (error) {
        console.error(error);
        alert('Something went wrong, Please try again!');
      }
    };
  };

  const getPlayers = async () => {
    try {
      const response = await fetch(`http://${hostName}:5000/runningIQuiz/players/${storedPin}`);
      const data = await response.json();
      // console.log(data)
      if(response.ok){
        // console.log('first')
        setPlayers(data);
      }else if(response.status===400){
        setCrossClicked(false);
        localStorage.removeItem('gamePin');
        sessionStorage.removeItem('runningIQuiz');
        console.log('first')
      }
    } catch (error) {
      // console.error(error);
    }
  }

  useEffect(() => {
    if (!storedPin) return;
  
    const intervalId = setInterval(() => {
      getPlayers();
      // console.log('first')
    }, 500);
  
    return () => clearInterval(intervalId);
  }, [storedPin]);

  const handleHost = async (iquiz) => {
    const id = iquiz._id;
    if(storedPin){
      alert('You already hosted an IQuiz!');
    }else{
      const confirmation = window.confirm('Are you sure to host this IQuiz?');
      if(confirmation){
        let pin = '';
        for(let i=0; i<6; i++){
          pin += Math.floor(Math.random(6)*10);
        };
        setIQuizPin(pin);
        localStorage.setItem('gamePin', pin);

        try {
          const response = await fetch(`http://${hostName}:5000/runningIQuiz/host`,{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loggedinUser, id, pin })
          });
          const data = await response.json();
          if(response.ok){
            setCrossClicked(true)
            sessionStorage.setItem('runningIQuiz', JSON.stringify(iquiz));
            // getPlayers(pin);
          }else if(response.status===409){
            alert(data.message);
          }else if(response.status===500){
            alert(data.message);
          }else{
            alert('Something went wrong, Please try again!!');
          }
        } catch (error) {
          console.error(error);
          alert('Something went wrong, Please try again!!');
        }
        console.log(pin);
        console.log(id);
      };
    }
  };

  const handleJoin = async () => {
    try {
      const response = await fetch(`http://${hostName}:5000/runningIQuiz/join`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, playerPin })
      });
      const data = await response.json();
      if(response.ok){
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('playerPin', playerPin);
        navigate('/in-game');
      }else if(response.status===404){
        alert(data.message);
      }else if(response.status===409){
        alert(data.message);
      }else if(response.status===500){
        alert(data.message);
      }else{
        alert('Something went wrong, Please try again!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, Please try again!');
    }
  };

  const handleStart = async () => {
    const savedIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
    try {
      const response = await fetch(`http://${hostName}:5000/runningIQuiz/status`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin: storedPin, status: 'Started', index: 0, timer: savedIQuiz.questions[0].timer })
      });
      const data = await response.json();
      if(response.ok){
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

  return (
    <div className='homeSection'>
      {loggedinUser && <>
        <div className='profileCard' style={{display:`${isProfileCard? 'flex' : 'none'}`}}>
          <i className='bx bx-x cross' onClick={hideProfileCard}></i>
          <span className='profilePic'>
            <i className='bx bxs-user'></i>
          </span>
          <p className='profileName'>{loggedinUser}</p>
          <button className='profileBtn' onClick={handleLogout}>Logout</button>
        </div>
      </>}

      <div className='popupSection' style={{display: `${ crossClicked ? 'flex' : 'none'}`}}>
        <div className='popupCard width95'>
          <i className='bx bx-x cross cross1' onClick={() => handleCross(iquizPin)}></i>
          <h1 style={{textAlign:'center'}}>Waiting for players...</h1>
          <p style={{fontSize:'30px', color:'gray'}}>Your game pin is:- <strong style={{color:'green'}}>{iquizPin}</strong></p>

          <div className="joinedPlayerSection">
            {players.map((player) => (
              <div className="joinedPlayer" key={player._id}>
                <i className="bx bxs-user"></i>
                <p>{player.name.length > 8 ? player.name.slice(0,7)+'...' : player.name}</p>
              </div>
            ))}
          </div>

          <div className='startStopButtons'>
            <button style={{background:'green', cursor:`${players.length===0? 'not-allowed' : 'pointer'}`}} disabled={players.length === 0} onClick={handleStart} >Start</button>
            <button style={{background:'red'}} onClick={() => handleCross(iquizPin)}>Stop</button>
            <span className='allPlayers'>
              <i className="bx bxs-user"></i>
              <p>{players.length}</p>
            </span>
          </div>

        </div>
      </div>

      <nav>
        <div className='navbar'>
          <div className='nav1'><span className='bName1'>IQ</span><span className='bName2'>uiz</span></div>
          <div className='nav2'></div>
          <div className='nav3'>
          {!loggedinUser && <>
            <button className='loginButton' onClick={() => {setShowSignUp(false); navigate('/login_signUp')}}>Login</button>
            <button className='signupButton loginButton ' onClick={() => {setShowSignUp(true); navigate('/login_signUp')}}>Sign-up</button>
          </>}
          {
            loggedinUser && <>
              <span className='profile' onClick={showProfileCard}>
                <i className='bx bxs-user'></i>
              </span>
              <p>{loggedinUser}</p>
            </>
          }
          </div>
        </div>
      </nav>
      <div className='homePage'>
        <form className='homePageForm' onSubmit={(e) => { e.preventDefault(); handleJoin()}}>
          <p></p>
          <input
            type='text'
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            autoFocus
            placeholder='Enter a nick name'
          />
          <input
            type='number'
            value={playerPin}
            onChange={(e) => setPlayerPin(e.target.value)}
            required
            placeholder='Enter your game pin'
          />
          <button className='loginButton' type='submit'>Join</button>
          {/* <p style={{marginTop:'30px'}}>*<a onClick={() => {setShowSignUp(false); navigate('/login_signUp')}}>Login</a>/<a onClick={() => {setShowSignUp(true); navigate('/login_signUp')}}>Sign-up</a> here to create your own quiz.</p> */}
        </form>
      </div>

      <div className='createIQuizButtons'>
        <button className='btn' onClick={() => {navigate(`${loggedinUser ? '/adding_iquiz' : '/login_signUp'}`)}}>Create a new IQuiz</button>
      </div>

      {loggedinUser && 
        <div className='iquizStoreSection'>
          <h1>Your saved IQuizzes</h1>

          {iquizzes.length > 0 ? (
            iquizzes.map((iquiz) => (
              <div className='iquizDiv' key={iquiz._id}>
                <div className='iquizPart1'>
                  <div className='titleDiv'>{iquiz.title}</div>
                  <div className='questionsDiv'>{iquiz.questions.length} Question{iquiz.questions.length>1 ? 's' : ''}</div>
                </div>
                <div className='iquizPart2'>
                  <button className='hostButton' onClick={() => handleHost(iquiz)}>Host Live</button>
                  <div className='editDeleteIcons'>
                    <i className='bx bxs-pencil' onClick={() => handleEdit(iquiz)} style={{color:'green'}}></i>
                    <i className='bx bxs-trash' onClick={() => handleDelete(iquiz._id)} style={{color:'red'}}></i>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No quizzes available</p>
          )}

        </div>
      }

      <hr/>
      <footer>
        <p className='footer1'>© 2025 IQuiz. created by <a href='https://linkedin.com/in/xritik'>Ritik</a>.</p>
        <div className='footer2'>
          <span className='fName1'>IQ</span><span className='fName2'>uiz</span>
        </div>
        <div className='socialMedia'>
          <a href='https://github.com/xritik' target='_blank'><span className='media'><i className='bx bxl-github'></i></span></a>
          <a href='https://linkedin.com/in/xritik' target='_blank'><span className='media'><i className='bx bxl-linkedin'></i></span></a>
          <a href='https://instagram.com/rittik__here' target='_blank'><span className='media'><i className='bx bxl-instagram'></i></span></a>
        </div>
      </footer>
    </div>
  )
}

export default Home