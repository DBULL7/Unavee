import React, { Component } from 'react'
import { render } from 'react-dom'

class Root extends Component {
  componentDidMount() {
    // INSERT API CALL TO YOUR INTERNAL API
    fetch('/api/v1/user/email')
    .then(results => results.json())
    .then((data) => {
      console.log(data)
    })
  }

  render() {
    return (
      <div>Hello World</div>
    )
  }
}

render(<Root />, document.getElementById('main'))
