import React from 'react'

const Home = () => {
  return (
    <div className='homeSection'>
      <nav>
        <div className='navbar'>
          <div className='nav1'><span className='bName1'>IQ</span><span className='bName2'>uiz</span></div>
          <div className='nav2'></div>
          <div className='nav3'>
          <button className='loginButton'>Login</button>
          <button className='signupButton'>Sign-up</button>
          </div>
        </div>
      </nav>
      <div className='homePage'>
        <form className='homePageForm'>
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
          <button className='loginButton'>Join</button>
          <p style={{marginTop:'30px'}}>*Login/Sign-up here to create your own quiz.</p>
        </form>
      </div>
      <hr/>
      <footer>
        <p className='footer1'>© 2025 IQuiz. created by <a href='https://linkedin.com/in/xritik'>Ritik</a>.</p>
        <div className='footer2'>
          <span className='fName1'>IQ</span><span className='fName2'>uiz</span>
        </div>
        <div className='socialMedia'>
          <a href='https://github.com/xritik' target='_blank'><span className='media'><i class='bx bxl-github'></i></span></a>
          <a href='https://linkedin.com/in/xritik' target='_blank'><span className='media'><i class='bx bxl-linkedin'></i></span></a>
          <a href='https://instagram.com/rittik__here' target='_blank'><span className='media'><i class='bx bxl-instagram'></i></span></a>
        </div>
      </footer>
    </div>
  )
}

export default Home