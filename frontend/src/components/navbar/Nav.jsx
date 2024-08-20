import React from 'react'
import './nav.css'
import Avatar from './Avatar'

function Nav() {
  return (
    <nav className='header-nav ms-auto'>
        <ul className='d-flex align-items-center'>
            <Avatar/>
        </ul>
      
    </nav>
  )
}

export default Nav
