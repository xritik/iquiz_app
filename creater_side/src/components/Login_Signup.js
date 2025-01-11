import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../css/login_signup.css';

const Login_Signup = ({navigate, showSignUp, setShowSignUp}) => {

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {

    try {
      const response = await fetch('http://localhost:5000/signUp', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      });
      const data = await response.json();
      if(response.ok){
        alert(data.message);
        localStorage.setItem('IQuiz_loginName', name);
        navigate('/home');
      }else if(response.status === 409){
        alert(data.message);
      }else if(response.status === 500){
          alert(data.message);
      } else{
          alert('Something went wrong, Please try again!!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, Please try again!!');
    }
  }


  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      });
      const data = await response.json();
      if(response.ok){
        alert(data.message);
        localStorage.setItem('IQuiz_loginName', name);
        navigate('/home');
      }else if(response.status === 401){
        alert(data.message);
      }else if(response.status === 500){
          alert(data.message);
      } else{
          alert('Something went wrong, Please try again!!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, Please try again!!');
    }
  }

  return (
    <div className='login-signup-section'>
      <i class='bx bx-arrow-back back_arrow' onClick={() => {navigate('/')}}></i>
      <div className={`wrapper ${showSignUp ? 'active' : ''} `}>
        <span className='bg-animate'></span>
        <span className='bg-animate2'></span>

        <div className='form-box login'>
          <h2 className='animation' style={{ "--i": 0, "--j":21 }}>Login</h2>
          <form action='#' onSubmit={(e) => {e.preventDefault(); handleLogin()}}>
            <div className='input-box animation' style={{ "--i": 1, "--j":22 }}>
              <input 
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Username</label>
              <i className='bx bxs-user'></i>
            </div>
            <div className='input-box animation' style={{ "--i": 2, "--j":23 }}>
              <input 
                type='password' 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
            </div>
            <button type='submit' className='btn animation' style={{ "--i": 3, "--j":24 }}>Login</button>
            <div className='logreg-link animation' style={{ "--i": 4, "--j":25 }}>
              <p>Don't have an account? <Link to={'#'} onClick={() => {setShowSignUp(true)}} >Sign Up</Link> </p>
            </div>
          </form>
        </div>
        <div className='info-text login'>
          <h2 className='animation' style={{ "--i": 0, "--j":20 }}>Welcome Back!</h2>
          <p className='animation' style={{ "--i": 1, "--j":21 }}>Lorem ipsum, dolor sit amet consectetur adipisicing</p>
        </div>

        <div className='form-box register'>
          <h2 className='animation' style={{ "--i": 17, "--j":0 }}>Sign Up</h2>
          <form action='#' onSubmit={(e) => {e.preventDefault(); handleSignup()}}>
            <div className='input-box animation' style={{ "--i": 18, "--j":1 }}>
              <input 
                type='text' 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Username</label>
              <i className='bx bxs-user'></i>
            </div>
            <div className='input-box animation' style={{ "--i": 19, "--j":2 }}>
              <input 
                type='password' 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
            </div>
            <button type='submit' className='btn animation' style={{ "--i": 20, "--j":3 }}>Sign Up</button>
            <div className='logreg-link animation' style={{ "--i": 21, "--j":4 }}>
              <p>Already have an account? <Link to={'#'} onClick={() => {setShowSignUp(false)}}>Login</Link> </p>
            </div>
          </form>
        </div>
        <div className='info-text register'>
          <h2 className='animation' style={{ "--i": 17, "--j":0 }}>Welcome Back!</h2>
          <p className='animation' style={{ "--i": 18, "--j":1 }}>Lorem ipsum, dolor sit amet consectetur adipisicing</p>
        </div>
      </div>
    </div>
  )
}

export default Login_Signup;