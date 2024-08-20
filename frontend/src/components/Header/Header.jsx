import React from 'react'
import './header.css'
import Logo from '../logo/Logo'
import SearchBar from '../searchBar/SearchBar'
import Nav from '../navbar/Nav'

function Header() {
  return (
    <header id='header' className='header fixed-top d-flex align-items-center'>
      <Logo/>
      <SearchBar/>
      <Nav/>
    </header>
  )
}

export default Header
