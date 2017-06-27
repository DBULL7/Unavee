import React, { Component } from 'react'
import { render } from 'react-dom'
import fakeData from '../dbullData.js'
import fakeWatsonData from '../fakeWatsonData.js'
import { WatsonData } from './WatsonData'
import { checkDatabaseForSearch } from './Helpers/HomeHelper'
import { NavLink } from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      logginModal: false,
      saveSuccessMessage: false,
      emailSuccessMessage: false,
      errorMessage: false,
      search: '',
    }
  }

  checkInput() {
    return (this.state.input !== '')
  }

  getPersonalityProfle() {
    fetch('api/v1/watson', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: this.props.getTweets})
    }).then(results => results.json())
    .then((data) => {
      console.log(data)
      this.setState({watsonResults: data})
    }).catch(error => {
      console.log(error);
    })
  }

  helper() {
    checkDatabaseForSearch(this.state.input, this.setState.bind(this), this.props.handleSearchResult.bind(this), this.props.handleTweets.bind(this))
    this.clearInput()
    this.setState({watsonResults: '', emailBody: '', subject: '', toneAnalysis: ''})
  }


  save() {
    if (this.props.loginUser.id) {
      const { name, picture, twitter, title, organization, location, LinkedIn, twitterID } = this.state
      fetch('/api/v1/user/favorites/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: name,
          picture: picture,
          twitter: twitter,
          twitterID: twitterID,
          title: title,
          organizations: organization,
          location: location,
          LinkedIn: LinkedIn,
          user_id: this.props.loginUser.id,
          email: this.state.input
        })
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({saveSuccessMessage: true})
      })
    } else {
      this.setState({logginModal: true, message: 'To Save a Search Please Sign in or Create an Account'})
    }
  }

  fadeOut() {
    setTimeout(() => {
      this.setState({logginModal: false, message: ''})
    }, 3000)
  }

  exitPopup() {
   this.setState({logginModal: false})
  }

  navigateTo(path) {
    this.props.history.replace(`/${path}`)
  }

  displayModal(message) {
    if(this.state.logginModal) {
      this.fadeOut()
      return (
        <article className='popup'>
          <div className='popup-header'>
            <button className='popup-exit-button' onClick={() => this.exitPopup()}>&times;</button>
          </div>
          <div>
            <p className='popup-message'>{message}</p>
            <div className='popup-buttons'>
              <button className='login-popup-button' onClick={() => this.navigateTo('Login')}>Login</button>
              <button className='createAccount-popup-button' onClick={() => this.navigateTo('CreateAccount')}>CreateAccount</button>
            </div>
          </div>
        </article>
      )
    }
  }

  showTwitterWatsonButton() {
    const { twitter } = this.props.search
    if (twitter) {
      return (
        <div>
          <button className='button'><a href={`${twitter}`} target="_blank">Twitter</a></button>
          <button className='button watson-button' onClick={() => {this.getPersonalityProfle()}}>Get Watson Personality Insight</button>
        </div>
      )
    }
  }

  checkEmailBody() {
    return (this.state.emailBody !== '')
  }

  successFadeOut() {
    setTimeout(() => {
      this.setState({emailSuccessMessage: false, saveSuccessMessage: false})
    }, 2500)
  }

  displaySuccessMessage() {
    if(this.state.emailSuccessMessage) {
      this.successFadeOut()
      return this.emailSuccessMessage()
    }
    else if(this.state.saveSuccessMessage) {
      this.successFadeOut()
      return this.saveSuccessMessage()
    }
  }

  emailSuccessMessage() {
    return (
      <div className='success-message-div'>
        <h4 className='success-message'><span className='success-message-color'>Email Sent!</span></h4>
      </div>
    )
  }

  saveSuccessMessage() {
    return (
      <div className='success-message-div'>
        <h4 className='success-message'><span className='success-message-color'>Saved!</span></h4>
      </div>
    )
  }

  loggedInAndEmailBody() {
    if (this.props.loginUser.id) {
      return (this.checkEmailBody())
    }
  }

  checkIfLoggedIn() {
    if (this.props.loginUser.id) {
      return true
    }
  }

  linkedInButton() {
    const { LinkedIn } = this.props.search
    if (LinkedIn) {
      return <button className='button'><a href={`${LinkedIn}`} target="_blank">LinkedIn</a></button>
    }
  }

  conditionalRender() {
    const { name, location, organization, title, twitter, LinkedIn, picture } = this.props.search
    if (name) {
      return (
        <section className='search-results'>
          <section className='search-result-data'>
            {this.displayModal(this.state.message)}
            <img className='results-pic' src={`${picture}`} alt='profile pic of searched individual'/>
            <h3>{name}</h3>
            <h4>{title}</h4>
            <h4>{organization}</h4>
            <h4>{location}</h4>
            <div className='social-media-buttons'>
              {this.linkedInButton()}
              {this.showTwitterWatsonButton()}
              <button disabled={!this.checkIfLoggedIn()} className='button' onClick={() => {this.save()}}>Save Search</button>
              <button className='button' onClick={() => {this.gotoSendEmail()}}>Send Email</button>
            </div>
          </section>
        </section>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  gotoSendEmail() {
    this.props.history.replace('/Message')
  }

  clearInput() {
    this.setState({input: ''})
  }

  enter(event) {
    if(event.key === 'Enter' && this.checkInput()) {
      this.helper()
    }
  }

  errorFadeOut() {
    setTimeout(() => {
      this.setState({errorMessage: false})
    }, 2000)
  }

  displayErrorMessage() {
    if(this.state.errorMessage) {
      this.errorFadeOut()
      return this.errorMessage()
    }
  }

  errorMessage() {
    return (
      <div className='error-message-div'>
        <h4 className='error-message'><span className='error-message-color'>No Results for That Email</span></h4>
      </div>
    )
  }

  links(login) {
    if (!login.name) {
      return (
        <ul className='home-sub-menu'>
          <li><NavLink to='/Login'>Login</NavLink></li>
          <li><NavLink to='/CreateAccount'>CreateAccount</NavLink></li>
        </ul>
      )
    }
    return (
      <ul className='home-sub-menu'>
        <li><NavLink to='/Favorites'>Favorites</NavLink></li>
        <li><NavLink to='/' onClick={() => test()}>Logout</NavLink></li>
      </ul>
    )
  }

  navBarDisplay() {
      return (
        <article className="searched">
          <div className='flash-message'>
            {this.displaySuccessMessage()}
            {this.displayErrorMessage()}
          </div>
            <div className='searched-bar-container'>
              <NavLink to='/' className='global-home-link'>Unavee</NavLink>
              <input className='searched-search-bar' value={this.state.input} onKeyPress={(e) => this.enter(e)} onChange={(e) => {this.setState({input: e.target.value})}} placeholder="Search by email"/>
              <nav className='home-menu'>
                <ul className='home-hamburger'>
                  <li><img className='menu-icon' src='../assets/menu.png'/></li>
                  {this.links(this.props.loginUser)}
                </ul>
              </nav>
            </div>
        </article>
      )
  }

  render() {
    return (
      <section className="searched-page">
        {this.navBarDisplay()}
        <section className='searched-page-body'>
          {this.conditionalRender()}
          <WatsonData watson={this.state.watsonResults}/>
        </section>
      </section>
    )
  }
}

export default Home
