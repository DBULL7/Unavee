import { connect } from 'react-redux'
import Search from './Search'
import { searchResults } from '../actions/index'


const dispatchMapStateToProps = (dispatch) => {
  return {
    handleSearchResult: (search) => {
      return dispatch(searchResults(search))
    }
  }
}

export default connect(null, dispatchMapStateToProps)(Search)
