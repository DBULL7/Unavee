import React, {Component} from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import HomeContainer from './HomeContainer'
import CreateAccountContainer from './CreateAccountContainer'
import LoginContainer from './LoginContainer'
import NavbarContainer from './NavbarContainer'
import FavoritesContainer from './FavoritesContainer'

class App extends Component {
  render() {
    return (
      <section>
        <NavbarContainer history={this.props.history}/>
        <Switch>
          <Route exact history={this.props.history} path='/Favorites' render={() => {
            return <FavoritesContainer/>
          }}/>
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
