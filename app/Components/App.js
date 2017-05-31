import React, {Component} from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import Unavee from './Unavee'
import CreateAccount from './CreateAccount'
import Login from './Login'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/CreateAccount' render={() => {
          return (
            <CreateAccount/>
          )
        }}/>
        <Route exact path='/Login' render={() => {
          return (
            <Login/>
          )
        }}/>
        <Route exact path='/Unavee' render={() => {
          return <Unavee />
        }}/>
      </Switch>
    )
  }
}

export default App
