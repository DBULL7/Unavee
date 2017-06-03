import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar = (props) => {
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
        {/* <li><NavLink to='/CreateAccount'>CreateAccount</NavLink></li> */}
      </ul>
    )
  }
  return (
      <nav className='nav-menu'>
        <ul className='clearfix'>
          <li><NavLink to='/'>Home</NavLink></li>
          {favorites(props)}
        </ul>
      </nav>
  )
}
