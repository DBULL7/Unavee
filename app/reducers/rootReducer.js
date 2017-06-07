import { combineReducers } from 'redux'
import loginUser from './loginUser'
import { search } from './search'
import getTweets from './getTweets'

const rootReducer = combineReducers({
  getTweets,
  search,
  loginUser,
})

export default rootReducer
