import { connect } from 'react-redux'
import { SearchNavbar } from './SearchNavbar'

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => {
      dispatch(logout())
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchNavbar)
