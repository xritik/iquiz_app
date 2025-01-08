import React from 'react'

const Home = ({navigate, setShowSignUp}) => {

  // const handleLogin = () => {
  //   navigate('/login_signUp')
  // }

  return (
    <div className='homeSection'>
      <nav>
        <div className='navbar'>
          <div className='nav1'><span className='bName1'>IQ</span><span className='bName2'>uiz</span></div>
          <div className='nav2'></div>
          <div className='nav3'>
          <button className='loginButton' onClick={() => {setShowSignUp(false); navigate('/login_signUp')}}>Login</button>
          <button className='signupButton loginButton ' onClick={() => {setShowSignUp(true); navigate('/login_signUp')}}>Sign-up</button>
          </div>
        </div>
      </nav>
      <div className='homePage'>
        <form className='homePageForm' onSubmit={(e) => { e.preventDefault(); navigate('/in_game')}}>
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
          <p style={{marginTop:'30px'}}>*<a onClick={() => {setShowSignUp(false); navigate('/login_signUp')}}>Login</a>/<a onClick={() => {setShowSignUp(true); navigate('/login_signUp')}}>Sign-up</a> here to create your own quiz.</p>
        </form>
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