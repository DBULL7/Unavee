import { connect } from 'react-redux'
import CreateAccount from './CreateAccount'
import { loginUser } from '../actions/index'


const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginUser: (login) => {
      dispatch(loginUser(login))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)
