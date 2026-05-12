import React, { useEffect, useState, useCallback } from 'react';
import socket from '../socket';

const Home = ({ HOST, navigate, setShowSignUp }) => {
  const loggedinUser = localStorage.getItem('IQuiz_loginName');
  const storedPin    = localStorage.getItem('gamePin');

  const [isProfileCard, setIsProfileCard] = useState(false);
  const [iquizzes, setIquizzes]           = useState([]);
  const [crossClicked, setCrossClicked]   = useState(!!storedPin);
  const [iquizPin, setIQuizPin]           = useState(storedPin || '');
  const [playerPin, setPlayerPin]         = useState('');
  const [playerName, setPlayerName]       = useState('');
  const [players, setPlayers]             = useState([]);

  // ─── Fetch saved IQuizzes ─────────────────────────────────────────────────
  const fetchIQuizzes = useCallback(async () => {
    if (!loggedinUser) return;
    try {
      const response = await fetch(`${HOST}/iquiz/${loggedinUser}`);
      const data = await response.json();
      if (response.ok) {
        setIquizzes(data);
      } else {
        alert(data.message || 'Something went wrong, please try again!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong, please try again!!');
    }
  }, [HOST, loggedinUser]);

  // ─── On mount ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchIQuizzes();

    if (storedPin) {
      socket.emit('host:join', storedPin);
      // Refresh player list in case of page reload
      fetch(`${HOST}/runningIQuiz/players/${storedPin}`)
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setPlayers(data); })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── WebSocket listeners ──────────────────────────────────────────────────
  useEffect(() => {
    const handlePlayersUpdate = (updatedPlayers) => setPlayers(updatedPlayers);

    const handleGameEnded = () => {
      setCrossClicked(false);
      setPlayers([]);
      localStorage.removeItem('gamePin');
      sessionStorage.removeItem('runningIQuiz');
    };

    const handleStatusUpdate = (data) => {
      if (data.status === 'Started') navigate('/question');
    };

    socket.on('players:update', handlePlayersUpdate);
    socket.on('game:ended', handleGameEnded);
    socket.on('game:statusUpdate', handleStatusUpdate);

    return () => {
      socket.off('players:update', handlePlayersUpdate);
      socket.off('game:ended', handleGameEnded);
      socket.off('game:statusUpdate', handleStatusUpdate);
    };
  }, [navigate]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('IQuiz_loginName');
    localStorage.removeItem('editingIQuiz');
    window.location.reload();
  };

  const handleEdit = (iquiz) => {
    localStorage.setItem('editingIQuiz', JSON.stringify(iquiz));
    navigate('/editing_iquiz');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to Delete this IQuiz?')) return;
    try {
      const response = await fetch(`${HOST}/iquiz/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        fetchIQuizzes();
        alert(data.message);
      } else {
        alert(data.message || 'Failed to delete IQuiz!');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Something went wrong, please try again!!');
    }
  };

  const handleCross = async (pin) => {
    if (!window.confirm('Are you sure to stop hosting of this IQuiz?')) return;
    try {
      const response = await fetch(`${HOST}/runningIQuiz/delete/${pin}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok || response.status === 404) {
        setCrossClicked(false);
        setPlayers([]);
        localStorage.removeItem('gamePin');
        sessionStorage.removeItem('runningIQuiz');
        alert(data.message);
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again!');
    }
  };

  const handleHost = async (iquiz) => {
    const currentPin = localStorage.getItem('gamePin');
    if (currentPin) { alert('You already hosted an IQuiz!'); return; }
    if (!window.confirm('Are you sure to host this IQuiz?')) return;

    const pin = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    setIQuizPin(pin);
    localStorage.setItem('gamePin', pin);

    try {
      const response = await fetch(`${HOST}/runningIQuiz/host`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loggedinUser, id: iquiz._id, pin }),
      });
      const data = await response.json();
      if (response.ok) {
        setCrossClicked(true);
        sessionStorage.setItem('runningIQuiz', JSON.stringify(iquiz));
        socket.emit('host:join', pin);
      } else {
        localStorage.removeItem('gamePin');
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('gamePin');
      alert('Something went wrong, please try again!!');
    }
  };

  const handleJoin = async () => {
    try {
      const response = await fetch(`${HOST}/runningIQuiz/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, playerPin }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('playerPin', playerPin);
        socket.emit('player:join', playerPin);
        navigate('/in-game');
      } else {
        alert(data.message || 'Something went wrong, please try again!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again!');
    }
  };

  const handleStart = async () => {
    const savedIQuiz = JSON.parse(sessionStorage.getItem('runningIQuiz'));
    const pin = localStorage.getItem('gamePin');
    try {
      const response = await fetch(`${HOST}/runningIQuiz/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          status: 'Started',
          index: 0,
          timer: savedIQuiz.questions[0].timer,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('storedIndex', 0);
        sessionStorage.setItem('time', savedIQuiz.questions[0].timer);
        navigate('/question');
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again!');
    }
  };

  return (
    <div className="homeSection">
      {/* Profile card */}
      {loggedinUser && (
        <div className="profileCard" style={{ display: isProfileCard ? 'flex' : 'none' }}>
          <i className="bx bx-x cross" onClick={() => setIsProfileCard(false)}></i>
          <span className="profilePic"><i className="bx bxs-user"></i></span>
          <p className="profileName">{loggedinUser}</p>
          <button className="profileBtn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* Waiting-for-players popup */}
      <div className="popupSection" style={{ display: crossClicked ? 'flex' : 'none' }}>
        <div className="popupCard width95">
          <i className="bx bx-x cross cross1" onClick={() => handleCross(iquizPin)}></i>
          <h1 style={{ textAlign: 'center' }}>Waiting for players...</h1>
          <p style={{ fontSize: '30px', color: 'gray' }}>
            Your game pin is:- <strong style={{ color: 'green' }}>{iquizPin}</strong>
          </p>
          <div className="joinedPlayerSection">
            {players.map((player) => (
              <div className="joinedPlayer" key={player._id || player.name}>
                <i className="bx bxs-user"></i>
                <p>{player.name.length > 8 ? player.name.slice(0, 7) + '...' : player.name}</p>
              </div>
            ))}
          </div>
          <div className="startStopButtons">
            <button
              style={{ background: 'green', cursor: players.length === 0 ? 'not-allowed' : 'pointer' }}
              disabled={players.length === 0}
              onClick={handleStart}
            >
              Start
            </button>
            <button style={{ background: 'red' }} onClick={() => handleCross(iquizPin)}>
              Stop
            </button>
            <span className="allPlayers">
              <i className="bx bxs-user"></i>
              <p>{players.length}</p>
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav>
        <div className="navbar">
          <div className="nav1"><span className="bName1">IQ</span><span className="bName2">uiz</span></div>
          <div className="nav2"></div>
          <div className="nav3">
            {!loggedinUser && (
              <>
                <button className="loginButton" onClick={() => { setShowSignUp(false); navigate('/login_signUp'); }}>Login</button>
                <button className="signupButton loginButton" onClick={() => { setShowSignUp(true); navigate('/login_signUp'); }}>Sign-up</button>
              </>
            )}
            {loggedinUser && (
              <>
                <span className="profile" onClick={() => setIsProfileCard(true)}>
                  <i className="bx bxs-user"></i>
                </span>
                <p>{loggedinUser}</p>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Join form */}
      <div className="homePage">
        <form className="homePageForm" onSubmit={(e) => { e.preventDefault(); handleJoin(); }}>
          <p></p>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} required autoFocus placeholder="Enter a nick name" />
          <input type="number" value={playerPin} onChange={(e) => setPlayerPin(e.target.value)} required placeholder="Enter your game pin" />
          <button className="loginButton" type="submit">Join</button>
        </form>
      </div>

      <div className="createIQuizButtons">
        <button className="btn" onClick={() => navigate(loggedinUser ? '/adding_iquiz' : '/login_signUp')}>
          Create a new IQuiz
        </button>
      </div>

      {/* Saved quizzes */}
      {loggedinUser && (
        <div className="iquizStoreSection">
          <h1>Your saved IQuizzes</h1>
          {iquizzes.length > 0 ? (
            iquizzes.map((iquiz) => (
              <div className="iquizDiv" key={iquiz._id}>
                <div className="iquizPart1">
                  <div className="titleDiv">{iquiz.title}</div>
                  <div className="questionsDiv">{iquiz.questions.length} Question{iquiz.questions.length > 1 ? 's' : ''}</div>
                </div>
                <div className="iquizPart2">
                  <button className="hostButton" onClick={() => handleHost(iquiz)}>Host Live</button>
                  <div className="editDeleteIcons">
                    <i className="bx bxs-pencil" onClick={() => handleEdit(iquiz)} style={{ color: 'green' }}></i>
                    <i className="bx bxs-trash" onClick={() => handleDelete(iquiz._id)} style={{ color: 'red' }}></i>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No quizzes available</p>
          )}
        </div>
      )}

      <hr />
      <footer>
        <p className="footer1">© 2025 IQuiz. created by <a href="https://linkedin.com/in/xritik">Ritik</a>.</p>
        <div className="footer2"><span className="fName1">IQ</span><span className="fName2">uiz</span></div>
        <div className="socialMedia">
          <a href="https://github.com/xritik" target="_blank" rel="noreferrer"><span className="media"><i className="bx bxl-github"></i></span></a>
          <a href="https://linkedin.com/in/xritik" target="_blank" rel="noreferrer"><span className="media"><i className="bx bxl-linkedin"></i></span></a>
          <a href="https://instagram.com/xritik.07" target="_blank" rel="noreferrer"><span className="media"><i className="bx bxl-instagram"></i></span></a>
        </div>
      </footer>
    </div>
  );
};

export default Home;