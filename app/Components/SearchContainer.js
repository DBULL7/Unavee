import { connect } from 'react-redux'
import Search from './Search'
import { searchResults, storeTweets } from '../actions/index'


const dispatchMapStateToProps = (dispatch) => {
  return {
    handleSearchResult: (search) => {
      return dispatch(searchResults(search))
    },
    handleTweets: (tweets) => {
      return dispatch(storeTweets(tweets))
    }
  }
}

export default connect(null, dispatchMapStateToProps)(Search)
