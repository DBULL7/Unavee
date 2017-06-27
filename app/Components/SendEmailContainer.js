import { connect } from 'react-redux'
import SendEmail from './SendEmail'

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(SendEmail)
