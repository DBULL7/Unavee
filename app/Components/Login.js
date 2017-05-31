import React, {Component} from 'react'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
  }

  login() {
    fetch('api/v1/signin', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    })
  }

  render() {
    return (
      <section>
        <h1>Login</h1>
        <article>
          <input onChange={(e) => {this.setState({email: e.target.value})}} placeholder='email'/>
          <input onChange={(e) => {this.setState({password: e.target.value})}} placeholder='password'/>
          <button onClick={() => {this.login()}}>Login</button>

        </article>
      </section>
    )
  }
}

export default Login
