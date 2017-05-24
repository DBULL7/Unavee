import React, { Component } from 'react'
import { render } from 'react-dom'

class Root extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      fullcontactResults: {}
    }
  }
  // componentDidMount() {
  //   // INSERT API CALL TO YOUR INTERNAL API
  // }

  getPlace() {
    fetch(`/api/v1/user?email=${this.state.input}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        // email: 'dbull@live.com'
        place: this.state.input
      })
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data)
      this.setState({fullcontactResults: data})
    })
  }

  conditionalRender() {
    if (this.state.fullcontactResults.city) {
      const {city} = this.state.fullcontactResults
      return (
        <section>
          <h4>{city}</h4>
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
