import React, { Component } from 'react'
import { render } from 'react-dom'
import fakeData from './dbullData.js'

class Root extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
    }
  }
  // componentDidMount() {
  //   // INSERT API CALL TO YOUR INTERNAL API

  //
  // }

  getTweets(twitterID) {
    fetch('api/v1/tweets', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: twitterID})
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data)
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
      </div>
    )
  }
}

render(<Root />, document.getElementById('main'))
