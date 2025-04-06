import React from 'react';
import '../css/notFound.css';
import image from '../imgs/404-page-not-found.png';
import {Link} from 'react-router-dom';

const NotFoundPage = ({ navigate }) => {
  return (
    <div className='notFoundSection'>
      <i className='bx bx-arrow-back back_arrow' onClick={() => {navigate('/')}}></i>
      <img className='pageNotFoundImage' src={image} alt='img'/>
      <div className='pageNotFoundText'>Page Not Found!</div>
      <Link to={'/'}>Back</Link>
    </div>
  )
}

export default NotFoundPage;