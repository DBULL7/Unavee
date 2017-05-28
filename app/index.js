import React, { Component } from 'react'
import { render } from 'react-dom'
import App from './Components/App'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'


render(
  <Router history={browserHistory}>
    <Route path='/' component={App}/>
  </Router>
  , document.getElementById('main'))
