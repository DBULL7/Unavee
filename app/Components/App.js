import React, {Component} from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import HomeContainer from './HomeContainer'
import CreateAccountContainer from './CreateAccountContainer'
import LoginContainer from './LoginContainer'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/CreateAccount' render={() => {
          return (
            <CreateAccountContainer/>
          )
        }}/>
        <Route exact path='/Login' render={() => {
          return (
            <LoginContainer/>
          )
        }}/>
        <Route exact path='/' render={() => {
          return <HomeContainer />
        }}/>
      </Switch>
    )
  }
}

export default App
