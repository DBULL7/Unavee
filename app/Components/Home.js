import React, { Component } from 'react'
import { render } from 'react-dom'
import fakeData from '../dbullData.js'
import fakeWatsonData from '../fakeWatsonData.js'
import { WatsonData } from './WatsonData'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      scrubbedTweets: { "contentItems": []},
      logginModal: false,
      emailBody: '',
      saveSuccessMessage: false,
      emailSuccessMessage: false,
      errorMessage: false,
      search: '',
    }
  }

  // componentWillMount() {
  //   // console.log('fired');
  //
  //
  // }

  checkInput() {
    return (this.state.input !== '')
  }

  toneAnalysis() {
    fetch('api/v1/emailAnalysis', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        text: `${this.state.emailBody}`
      })
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data);
      this.setState({toneAnalysis: data})
    })
  }

  sendEmail() {
    if(this.props.loginUser.email) {
      fetch('api/v1/sendgrid', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: `${this.state.search}`,
          from: `${this.props.loginUser.email}`,
          subject: `${this.state.subject}`,
          content: `${this.state.emailBody}`
        })
      })
      .then(results => results.json())
      .then((data) => {
        console.log(data);
        this.setState({emailSuccessMessage: true, emailBody: '', subject: '', toneAnalysis: ''})
      })
    } else {
      this.setState({logginModal: true, message: 'To Send An Email Sign in or Create an Account'})
    }
  }

  getPersonalityProfle() {
    // this.setState({watsonResults: fakeWatsonData})
    fetch('api/v1/watson', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: this.state.scrubbedTweets})
    }).then(results => results.json())
    .then((data) => {
      console.log(data)
      this.setState({watsonResults: data})
    }).catch(error => {
      console.log(error);
    })
  }

  scrubTweets(data) {
    console.log(data);
    data.forEach((tweet) => {
      this.state.scrubbedTweets.contentItems.push({
        "content": tweet.text,
        "contenttype": "text/plain",
        "id": tweet.id,
        "language": "en"
      })
    })
    console.log(this.state.scrubbedTweets.contentItems);
  }

  getTweets(twitterID) {
    if(twitterID) {
      fetch('api/v1/tweets', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: twitterID})
      })
      .then(results => results.json())
      .then((data) => {
        console.log(data)
        this.scrubTweets(data)
        this.setState({lookedUpTweets: data})
      }).catch(error => {
        console.log(error)
      })
    }
  }

  checkDatabaseForSearch() {
    const search = this.state.input
    fetch(`/api/v1/${search}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      this.databaseSearchResult(data)
      this.setState({search: search})
      this.clearInput()
    }).catch(error => {
      console.log(error)
      this.fullContactAPICall()
    })
  }

  databaseSearchResult(data) {
    const { name, organization, title, location, picture, LinkedIn, twitter, twitterID } = data[0]
    this.setState({ name: name,
                    organization: organization,
                    title: title,
                    location: location,
                    picture: picture,
                    LinkedIn: LinkedIn,
                    twitter: twitter,
                    twitterID: twitterID
                  })
    this.getTweets(twitterID)
  }


  fullContactAPICall() {
    fetch(`/api/v1/user?email=${this.state.input}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        // email: 'dbull@live.com'
        email: this.state.input
      })
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data)
      this.scrubSearch(data)
    }).catch(error => {
      console.log(error)
      this.setState({errorMessage: true})
    })
    // need to save the data to our db
    // this.scrubSearch(fakeData)
  }

  scrubSearch(data) {
    const { contactInfo, demographics, socialProfiles, organizations, photos } = data
    let twitter = ''
    let linkedin = ''
    let twitterID = ''
    if (socialProfiles) {
      socialProfiles.forEach(account => {
        if (account.type === 'twitter') {
          twitter = account.url
          twitterID = account.id
          this.getTweets(account.id)
          this.setState({twitter: account.url})
        } else if (account.type === 'linkedin') {
          this.setState({LinkedIn: account.url})
          linkedin = account.url
        }
      })
    }
    let picture = ''
    if (photos) {
      let photo = photos.forEach(photo => {
        if(photo.isPrimary) {
          this.setState({picture: photo.url})
          picture = photo.url
        }
      })
    }
    console.log(organizations);
    if (organizations) {
      this.setState({organization: organizations[0].name, title: organizations[0].title})
    }
    if(demographics) {
      this.setState({location: demographics.locationGeneral})
    }
    this.setState({
      name: contactInfo.fullName,
    })
    const test = (organizations) => {
      if (organizations) {
        return organizations[0].title
      } else {
        return ''
      }
    }
    const test2 = (organizations) => {
      if (organizations) {
        return organizations[0].name
      } else {
        return ''
      }
    }
    const location = (demographics) => {
      if(demographics) {
        return demographics.locationGeneral
      } else {
        return ''
      }
    }
    fetch('/api/v1/searches/new', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
                            search: this.state.input,
                            name: contactInfo.fullName,
                            organization: test2(organizations),
                            title: test(organizations),
                            location: location(demographics),
                            picture: picture,
                            LinkedIn: linkedin,
                            twitter: twitter,
                            twitterID: twitterID
      })
    }).then(res => res.json())
    .then(data => {
      console.log(data)
      this.clearInput()
    })
  }


  displayToneAnalysis() {
    if(this.state.toneAnalysis) {
      const { tone_categories } = this.state.toneAnalysis.document_tone
      let emoticon = (categoryName) => {
        switch (categoryName) {
          case 'Anger':
            return '😡'
          case 'Disgust':
            return '🤢'
          case 'Fear':
            return '😱'
          case 'Joy':
            return '😄'
          case 'Sadness':
            return '😓'
          default:
            return '😐'
        }
      }
      let emotions = tone_categories[0].tones.map(category => {
        if (category.score > .5) {
          return (
            <div>
              <p>{emoticon(category.tone_name)}</p>
              <p>Probability: {Math.round(category.score*100)}%</p>
            </div>
          )
        }
      })
      return (
        <div className="tone">
            <h4>Message Emotional Tone</h4>
            <div className='emotions'>
              {emotions}
            </div>
        </div>
      )
    }
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
    const { twitter } = this.state
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

  conditionalRender() {
    const { name, location, organization, title, twitter, LinkedIn, picture } = this.state
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
              <button className='button'><a href={`${LinkedIn}`} target="_blank">LinkedIn</a></button>
              {this.showTwitterWatsonButton()}
              <button disabled={!this.checkIfLoggedIn()} className='button' onClick={() => {this.save()}}>Save Search</button>
            </div>
          </section>
          <section className="email">
            <input value={this.state.subject} onChange={(e) => {this.setState({subject: e.target.value})}} name="subject" placeholder="Subject"/>
            <textarea value={this.state.emailBody} onChange={(e) => {this.setState({emailBody: e.target.value})}} name="email-body" placeholder={`Send ${this.state.name} a quick email`}/>
            <article>
              <button  disabled={!this.loggedInAndEmailBody()} className='button' onClick={() => {this.sendEmail()}}>Send Email</button>
              <button disabled={!this.checkEmailBody()} className='button' onClick={() => {this.toneAnalysis()}}>Run Sentiment Analysis</button>
              {this.displayToneAnalysis()}
            </article>
          </section>
        </section>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  clearInput() {
    this.setState({input: ''})
  }

  enter(event) {
    if(event.key === 'Enter' && this.checkInput()) {
      this.checkDatabaseForSearch()
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

  navBarDisplay() {
    if(this.state.search) {
      return (
        <article className="searched">
          <h1 className='searched-title'>Unavee</h1>
          <div className='searched-form'>
            {this.displaySuccessMessage()}
            {this.displayErrorMessage()}
            <div className='searched-bar-container'>
              <input className='searched-search-bar' value={this.state.input} onKeyPress={(e) => this.enter(e)} onChange={(e) => {this.setState({input: e.target.value})}} placeholder="Search by email"/>
            </div>
          </div>
        </article>
      )
    }
    return (
      <article className='home-search'>
        {this.displayErrorMessage()}
        <h1 className='home-title'>Unavee</h1>
        <div className='home-form'>
          <div className='search-bar-container'>
            <input className='home-search-bar' value={this.state.input} onKeyPress={(e) => this.enter(e)} onChange={(e) => {this.setState({input: e.target.value})}} placeholder="Search by email"/>
          </div>
          <button id="search-button" className="button" disabled={!this.checkInput()} onClick={() => {this.checkDatabaseForSearch()}}>Search</button>
        </div>
      </article>
    )
  }

  render() {
    return (
      <section>
        {this.navBarDisplay()}
        {this.conditionalRender()}
        <WatsonData watson={this.state.watsonResults}/>
      </section>
    )
  }
}

export default Home
