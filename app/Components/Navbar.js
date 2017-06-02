import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar = (props) => {
  const favorites = (login) => {
    if (!login.loginUser.name) {
      return
    }
    return (
      <li><NavLink to='/Favorites'>Favorites</NavLink></li>
    )
  }
  return (
      <nav className='nav-menu'>
        <ul className='clearfix'>
          <li><NavLink to='/'>Home</NavLink></li>
          <ul className='sub-menu'>
            {favorites(props)}
            <li><NavLink to='/Login'>Login</NavLink></li>
            <li><NavLink to='/CreateAccount'>CreateAccount</NavLink></li>
          </ul>
        </ul>
      </nav>
  )
}
