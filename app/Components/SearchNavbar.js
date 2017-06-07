import React from 'react'
import { NavLink, Switch, Route } from 'react-router-dom'

export const SearchNavbar = (props) => {
  const test = () => {
    this.props.handleLogout()
  }

  const favorites = (login) => {
    if (!login.loginUser.name) {
      return (
        <ul className='sub-menu'>
          <li><NavLink to='/Login'>Login</NavLink></li>
          <li><NavLink to='/CreateAccount'>CreateAccount</NavLink></li>
        </ul>
      )
    }
    return (
      <ul className='sub-menu'>
        <li><NavLink to='/Favorites'>Favorites</NavLink></li>
        <li><NavLink to='/' onClick={() => test()}>Logout</NavLink></li>
      </ul>
    )
  }
  return (
    <nav className='nav-menu'>
      <ul className='clearfix'>
        <li><img className='menu-icon' src='../assets/menu.png'/></li>
        {favorites(props)}
      </ul>
    </nav>
  )
}
