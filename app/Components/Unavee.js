import React, { Component } from 'react'
import { render } from 'react-dom'
import fakeData from '../dbullData.js'
import fakeWatsonData from '../fakeWatsonData.js'
import { WatsonData } from './WatsonData'
// import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'

class Unavee extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      scrubbedTweets: { "contentItems": []}
    }
  }

  componentWillMount() {
    // console.log('fired');


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
    fetch('api/v1/sendgrid', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: 'dbull@live.com',
        from: 'devjbull@gmail.com',
        subject: `${this.state.subject}`,
        content: `${this.state.emailBody}`
      })
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data);
    })
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

  getPlace() {
    const {contactInfo, demographics, socialProfiles, organizations, photos} = fakeData
    let twitterUrl = socialProfiles.forEach(account => {
      if (account.type === 'twitter') {
        console.log(account.url)
        this.getTweets(account.id)
        this.setState({twitter: account.url})
      } else if (account.type === 'linkedin') {
        this.setState({LinkedIn: account.url})
      }
    })

    let photo = photos.forEach(photo => {
      if(photo.isPrimary) {
        this.setState({picture: photo.url})
      }
    })

    console.log(fakeData);
    this.setState({
      name: contactInfo.fullName,
      organizations: organizations[0].name, // need to make this dynamic in case they have more than one org.
      title: organizations[0].title,
      location: demographics.locationGeneral,
      })
    }
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
            <h4>
              Language Tone
            </h4>
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

  conditionalRender() {
    const { name, location, organizations, title, twitter, LinkedIn, picture } = this.state
    if (name) {
      return (
        <section>
          <img src={`${picture}`}/>
          <h4>{name}</h4>
          <h4>{title}</h4>
          <h4>{organizations}</h4>
          <h4>{location}</h4>
          <button><a href={`${twitter}`} target="_blank">Twitter</a></button>
          <button><a href={`${LinkedIn}`} target="_blank">LinkedIn</a></button>
          <button onClick={() => {this.getPersonalityProfle()}}>Watson</button>
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

  render() {
    return (
      <div>
        <h1>Unavee</h1>
        <input onChange={(e) => {this.setState({input: e.target.value})}} placeholder="Search by email or Twitter handle"/>
        <button onClick={() => {this.getPlace()}}>Enter</button>
        {this.conditionalRender()}
        <WatsonData watson={this.state.watsonResults}/>
      </div>
    )
  }
}

export default Unavee
