import { connect } from 'react-redux'
import Home from './Home'
import { searchResults, storeTweets } from '../actions/index'


const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSearchResult: (search) => {
      return dispatch(searchResults(search))
    },
    handleTweets: (tweets) => {
      return dispatch(storeTweets(tweets))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
