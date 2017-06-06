import { combineReducers } from 'redux'
import loginUser from './loginUser'
import { search } from './search'

const rootReducer = combineReducers({
  search,
  loginUser,
})

export default rootReducer
