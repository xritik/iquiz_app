import React from 'react'
import '../css/dashboard.css'
import { Link } from 'react-router-dom'

const Dashboard = ({navigate}) => {
  return (
    <div className='dashboardSection'>
        <nav>
            <div className='navbar'>
                <div className='nav1'><span className='bName1'>IQ</span><span className='bName2'>uiz</span></div>
                <div className='nav2'>
                    <Link></Link>
                </div>
                <div className='nav3'>
                    <button className='loginButton' onClick={() => { navigate('/home')}}>Logout</button>
                </div>
            </div>
        </nav>
        <div className='dashboardButtons'>
            <button className='btn'>Create a IQuiz</button>
            <button className='btn' onClick={() => {navigate('/home')}} >Play a IQuiz</button>
        </div>
    </div>
  )
}

export default Dashboard;