import React, { useState } from 'react'

const Home = ({navigate, setShowSignUp}) => {

  const loggedinUser = localStorage.getItem('IQuiz_loginName')
  const [isProfileCard, setIsProfileCard] = useState(false);

  const handleJoinGame = async() => {
    window.open('http://localhost:3001/');
    // try {
    //   const response = await fetch('http://localhost:5000/start-game', {
    //     method: 'POST',
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     alert(result.message);
    //     navigate('http://localhost:3001/');
    //   } else {
    //     alert('Failed to start IQuiz!');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('Error starting IQuiz!');
    // }
  }

  const showProfileCard = () => {
    setIsProfileCard(true);
  }
  const hideProfileCard = () => {
    setIsProfileCard(false);
  }

  const handleLogout = () => {
    localStorage.removeItem('IQuiz_loginName');
    window.location.reload();
  }

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
        <form className='homePageForm' onSubmit={(e) => { e.preventDefault(); handleJoinGame()}}>
          <p></p>
          <input
            type='text'
            required
            autoFocus
            placeholder='Enter a nick name'
          />
          <input
            type='number'
            required
            placeholder='Enter your game pin'
          />
          <button className='loginButton' type='submit'>Join</button>
          {/* <p style={{marginTop:'30px'}}>*<a onClick={() => {setShowSignUp(false); navigate('/login_signUp')}}>Login</a>/<a onClick={() => {setShowSignUp(true); navigate('/login_signUp')}}>Sign-up</a> here to create your own quiz.</p> */}
        </form>
      </div>

      <div className='createIQuizButtons'>
        <button className='btn'>Create a IQuiz</button>
      </div>

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