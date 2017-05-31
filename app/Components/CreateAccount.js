import React, {Component} from 'react'

class CreateAccount extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      password: '',
      retypedPassword: ''
    }
  }

  createAccount() {
    fetch('api/v1/users/new', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: this.state.email, password: this.state.password, name: this.state.name})
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data)
    }).catch((error) => {
      console.log(error);
    })
  }

  render() {
    return (
      <section className='create-account'>
        <section className='create-account-form'>
          <h1>CreateAccount</h1>
          <input onChange={(e)=> {this.setState({name: e.target.value})}} placeholder='Name'/>
          <input onChange={(e)=> {this.setState({email: e.target.value})}} placeholder='Email'/>
          <input onChange={(e)=> {this.setState({password: e.target.value})}} placeholder='Password'/>
          <input onChange={(e)=> {this.setState({retypedPassword: e.target.value})}} placeholder='Retype Password'/>
          <button onClick={() => {this.createAccount()}}>Create Account</button>
        </section>
      </section>
    )
  }
}

export default CreateAccount


//create account
// console.log('fired');
