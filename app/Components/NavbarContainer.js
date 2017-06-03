import { connect } from 'react-redux'
import { Navbar } from './Navbar'
import { logout } from '../actions/index'

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

export default connect(mapStateToProps, null)(Navbar)
