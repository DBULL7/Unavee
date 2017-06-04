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
      searched: false,
      scrubbedTweets: { "contentItems": []},
      logginModal: false
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
          email: `${this.state.input}`,
          from: `${this.props.loginUser.email}`,
          subject: `${this.state.subject}`,
          content: `${this.state.emailBody}`
        })
      })
      .then(results => results.json())
      .then((data) => {
        console.log(data);
      })
    } else {
      console.log('not signed in')
      this.setState({logginModal: true, message: 'To Send An Email Sign in or Create an Account'})
    }
  }

  getPersonalityProfle() {
    this.setState({watsonResults: fakeWatsonData})
    // fetch('api/v1/watson', {
    //   method: 'POST',
    //   headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify({text: this.state.scrubbedTweets})
    // }).then(results => results.json())
    // .then((data) => {
    //   console.log(data)
    //   this.setState({watsonResults: data})
    // })
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
    })
  }

  checkDatabaseForSearch() {
    const search = this.state.input
    fetch(`/api/v1/${search}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      this.databaseSearchResult(data)
    }).catch(error => {
      console.log(error)
      this.fullContactAPICall()
    })
  }

  databaseSearchResult(data) {
    const { name, organization, title, location, picture, LinkedIn, twitter } = data[0]
    this.setState({ name: name,
                    organization: organization,
                    title: title,
                    location: location,
                    picture: picture,
                    LinkedIn: LinkedIn,
                    twitter: twitter
                  })
  }


  fullContactAPICall() {
    // fetch(`/api/v1/user?email=${this.state.input}`, {
    //   method: "POST",
    //   headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify({
    //     // email: 'dbull@live.com'
    //     email: this.state.input
    //   })
    // })
    // .then(results => results.json())
    // .then((data) => {
    //   console.log(data)
    // })
    // }
    // need to save the data to our db
    this.scrubSearch(fakeData)
  }

  scrubSearch(data) {
    const { contactInfo, demographics, socialProfiles, organizations, photos } = data
    let twitter = ''
    let linkedin = ''
    socialProfiles.forEach(account => {
      if (account.type === 'twitter') {
        twitter = account.url
        this.getTweets(account.id)
        this.setState({twitter: account.url})
      } else if (account.type === 'linkedin') {
        this.setState({LinkedIn: account.url})
        linkedin = account.url
      }
    })
    let picture = ''
    let photo = photos.forEach(photo => {
      if(photo.isPrimary) {
        this.setState({picture: photo.url})
        picture = photo.url
      }
    })

    this.setState({
      name: contactInfo.fullName,
      organization: organizations[0].name, // need to make this dynamic in case they have more than one org.
      title: organizations[0].title,
      location: demographics.locationGeneral,
    })

    fetch('/api/v1/searches/new', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
                            search: this.state.input,
                            name: contactInfo.fullName,
                            organization: organizations[0].name,
                            title: organizations[0].title,
                            location: demographics.locationGeneral,
                            picture: picture,
                            LinkedIn: linkedin,
                            twitter: twitter,
      })
    }).then(res => res.json())
    .then(data => {
      console.log(data)
    })
  }


  displayToneAnalysis() {
    if(this.state.toneAnalysis) {
      const { tone_categories } = this.state.toneAnalysis.document_tone
      let test = tone_categories[1].tones.map(category => {
        return (
          <div>
            <p>{category.tone_name}</p>
            <p>{category.score}</p>
          </div>
        )
      })
      let test2 = tone_categories[0].tones.map(category => {
        return (
          <div>
            <p>{category.tone_name}</p>
            <p>{category.score}</p>
          </div>
        )
      })
      return (
        <div className="tone">
          <div>
            <h4>Language Tone</h4>
            {test}
          </div>
          <div>
            <h4>Emotion Tone</h4>
            {test2}
          </div>
        </div>
      )
    }
  }

  save() {
    if (this.props.loginUser.id) {
      const { name, picture, twitter, title, organization, location, LinkedIn } = this.state
      fetch('/api/v1/user/favorites/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: name,
          picture: picture,
          twitter: twitter,
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
          <button><a href={`${twitter}`} target="_blank">Twitter</a></button>
          <button onClick={() => {this.getPersonalityProfle()}}>Watson</button>
        </div>
      )
    }
  }

  conditionalRender() {
    const { name, location, organization, title, twitter, LinkedIn, picture } = this.state
    if (name) {
      return (
        <section>
          {this.displayModal(this.state.message)}
          <img src={`${picture}`}/>
          <h3>{name}</h3>
          <h4>{title}</h4>
          <h4>{organization}</h4>
          <h4>{location}</h4>
          <button><a href={`${LinkedIn}`} target="_blank">LinkedIn</a></button>
          {this.showTwitterWatsonButton()}
          <button onClick={() => {this.save()}}>Save Search</button>
          <section className="email">
            <input onChange={(e) => {this.setState({subject: e.target.value})}} name="subject" placeholder="Subject"/>
            <textarea onChange={(e) => {this.setState({emailBody: e.target.value})}} name="email-body" placeholder={`Send ${this.state.name} a quick email`}/>
            <article>
              <button onClick={() => {this.sendEmail()}}>Send Email</button>
              <button onClick={() => {this.toneAnalysis()}}>Run Sentiment Analysis</button>
            </article>
          </section>
          {this.displayToneAnalysis()}
        </section>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  clearInput() {
    this.setState({input: '', searched: true})
  }

  navBarDisplay() {
    if(this.state.searched) {
      return (
        <article className="searched">
          <h1>Unavee</h1>
          <div>
            <input value={this.state.input} onChange={(e) => {this.setState({input: e.target.value})}} placeholder="Search by email"/>
            <button disabled={!this.checkInput()} onClick={() => {this.checkDatabaseForSearch(); this.clearInput()}}>Enter</button>
          </div>
        </article>
      )
    }
    return (
      <article className='home-search'>
        <h1 className='home-title'>Unavee</h1>
        <div className='home-form'>
          <div className='search-bar-container'>
            <input className='home-search-bar' value={this.state.input} onChange={(e) => {this.setState({input: e.target.value})}} placeholder="Search by email"/>
          </div>
          <button className="home-search-button" disabled={!this.checkInput()} onClick={() => {this.checkDatabaseForSearch(); this.clearInput()}}>Search</button>
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
