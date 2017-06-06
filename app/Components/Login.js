import React, {Component} from 'react'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: false
    }
  }

  emailAndPassword() {
    return (this.state.password !== '' && this.state.email !== '')
  }

  login() {
    if (this.emailAndPassword()) {
      fetch('api/v1/signin', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: this.state.email, password: this.state.password })
      })
      .then(results => results.json())
      .then((data) => {
        console.log(data);
        const {email, id, name} = data[0]
        this.props.handleLoginUser({id: id, email: email, name: name})
        this.props.history.replace('/Home')
      }).catch(error => {
        console.log(error);
        this.setState({error: true})
      })
    }
  }

  fadeOut() {
    setTimeout(() => {
      this.setState({error: false})
    }, 3000)
  }

  displayErrorMessage() {
    if(this.state.error) {
      this.fadeOut()
      return this.errorMessage()
    }
  }

  errorMessage() {
    return (
      <div className='error-message-div'>
        <h4 className='error-message'><span className='error-message-color'>Email or Password doesn't match</span></h4>
      </div>
    )
  }

  render() {
    return (
      <section className='login'>
        {this.displayErrorMessage()}
        <h1 className='login-title'>Login</h1>
        <article className='login-form'>
          <input className='login-email-input login-input' onChange={(e) => {this.setState({email: e.target.value})}} placeholder='email'/>
          <input className='login-password-input login-input' onChange={(e) => {this.setState({password: e.target.value})}} placeholder='password'/>
          <button disabled={!this.emailAndPassword()} className='login-button' onClick={() => {this.login()}}>Login</button>

        </article>
      </section>
    )
  }
}

export default Login
