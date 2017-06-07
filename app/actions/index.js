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

export const searchResults = (searchResults) => {
  return {
    type: 'SEARCH_RESULTS',
    searchResults
  }
}

export const storeTweets = (tweets) => {
  return {
    type: 'GET_TWEETS',
    tweets
  }
}
