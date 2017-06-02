import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <section>
      <NavLink to='/'>Home</NavLink>
      <NavLink to='/Favorites'>Favorites</NavLink>
      <NavLink to='/Login'>Login</NavLink>
      <NavLink to='/CreateAccount'>CreateAccount</NavLink>
    </section>
  )
}
