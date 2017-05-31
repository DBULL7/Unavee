import React, {Component} from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import HomeContainer from './HomeContainer'
import CreateAccountContainer from './CreateAccountContainer'
import LoginContainer from './LoginContainer'
import { Navbar } from './Navbar'

class App extends Component {
  render() {
    return (
      <section>
        <Navbar history={this.props.history}/>
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
      </section>
    )
  }
}

export default App
