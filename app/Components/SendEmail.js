import React, { Component } from 'react'

class SendEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subject: '',
      emailBody: ''
    }
  }
  
  checkEmailBody() {
    return (this.state.emailBody !== '')
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

  sendEmail() {
    if(this.props.loginUser.email) {
      fetch('api/v1/sendgrid', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: `${this.props.search.search}`,
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

  render() {
    return (
      <section className="email">
        <input value={this.state.subject} onChange={(e) => {this.setState({subject: e.target.value})}} name="subject" placeholder="Subject"/>
        <textarea value={this.state.emailBody} onChange={(e) => {this.setState({emailBody: e.target.value})}} name="email-body" placeholder={`Send ${this.props.search.name} a quick email`}/>
        <article>
          <button  className='button' onClick={() => {this.sendEmail()}}>Send Email</button>
          <button disabled={!this.checkEmailBody()} className='button wide-button' onClick={() => {this.toneAnalysis()}}>Run Sentiment Analysis</button>
          {this.displayToneAnalysis()}
        </article>
      </section>
    )
  }
}

export default SendEmail
