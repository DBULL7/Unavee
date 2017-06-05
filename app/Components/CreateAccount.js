import React, { Component } from 'react'

class CreateAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      retypedPassword: '',
      error: false
    }
  }

  emailRegex() {
    if (this.state.email !== '') {
      let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(this.state.email)
    }
  }

  passwordsMatch() {
    return (this.state.retypedPassword !== '' && this.state.password === this.state.retypedPassword)
  }

  nameAndEmail() {
    return (this.state.name !== '' && this.emailRegex())
  }

  createAccount() {
    //need to see if user already exists
    if(this.passwordsMatch() && this.nameAndEmail()) {
      fetch('api/v1/users/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: this.state.email, password: this.state.password, name: this.state.name})
      })
      .then(results => results.json())
      .then((data) => {
        console.log(data)
        this.props.handleLoginUser({id: data.id, email: this.state.email, name: this.state.name})
      }).catch((error) => {
        this.setState({error: true})
      })
    }
  }

  fadeOut() {
    setTimeout(() => {
      this.setState({error: false})
    }, 2500)
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
        <h4 className='error-message'><span className='error-message-color'>Email Taken</span></h4>
      </div>
    )
  }

  render() {
    return (
      <section className='create-account'>
          {this.displayErrorMessage()}
        <section className='create-account-form'>
          <h1 className='create-account-title'>CreateAccount</h1>
          <input value={this.state.name} className='create-account-input-name create-account-input' onChange={(e)=> {this.setState({name: e.target.value})}} placeholder='Name'/>
          <input value={this.state.email} className='create-account-input-email create-account-input' onChange={(e)=> {this.setState({email: e.target.value})}} placeholder='Email'/>
          <input value={this.state.password} className='create-account-input-password create-account-input' onChange={(e)=> {this.setState({password: e.target.value})}} placeholder='Password'/>
          <input value={this.state.retypedPassword} className='create-account-input-retypedPassword create-account-input' onChange={(e)=> {this.setState({retypedPassword: e.target.value})}} placeholder='Retype Password'/>
          <button id='create-account-button' disabled={!(this.passwordsMatch() && this.nameAndEmail())} onClick={() => {this.createAccount()}}>Create Account</button>
        </section>
      </section>
    )
  }
}

export default CreateAccount


//create account
// console.log('fired');
