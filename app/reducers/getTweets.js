const getTweets = (state=[], action) => {
  switch (action.type) {
    case 'GET_TWEETS':

      return action.tweets
    default:
      return state
  }
}

export default getTweets
