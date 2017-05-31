import React, { Component } from 'react'
import { render } from 'react-dom'
import App from './Components/App'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from './configureStore'

const store = configureStore()

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}/>
    </Router>
  </Provider>
  , document.getElementById('main'))
