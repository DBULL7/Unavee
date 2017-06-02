import Favorites from './Favorites'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(Favorites)
