import React from 'react'
import '../css/playing_game_user_page.css'

const PlayingGameUserPage = ({ navigate }) => {
  return (
    <div className='section'>
      <i class='bx bx-arrow-back back_arrow' onClick={() => {navigate('/dashboard')}}></i>

      <div className='showQuestion'>
        <div className='questionNo'>1.</div>
        <div className='question'>Choose the correct option for 3+4=?</div>
      </div>

      <div className='timer'>
        <span>20</span>
      </div>

      <div className='options'>
        <div className='option'>
          <div>Option1</div>
          <div>Option2</div>
        </div>
        <div className='option'>
          <div>This is Option3</div>
          <div>Option4</div>
        </div>
      </div>

    </div>
  )
}

export default PlayingGameUserPage