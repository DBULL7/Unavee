export const loginUser = (loginUser) => {
  return {
    type: 'LOGIN_USER',
    loginUser
  }
}

export const logout = (user) => {
  return {
    type: 'LOGOUT'
  }
}
