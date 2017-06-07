import React, {Component} from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import HomeContainer from './HomeContainer'
import CreateAccountContainer from './CreateAccountContainer'
import LoginContainer from './LoginContainer'
import NavbarContainer from './NavbarContainer'
import FavoritesContainer from './FavoritesContainer'
import SearchContainer from './SearchContainer'

class App extends Component {
  render() {
    return (
      <section>
        <NavbarContainer history={this.props.history}/>
        <Switch>
          <Route exact history={this.props.history} path='/Favorites' render={() => {
            return <FavoritesContainer history={this.props.history}/>
          }}/>
          <Route exact path='/CreateAccount' history={this.props.history} render={() => {
            return (
              <CreateAccountContainer history={this.props.history}/>
            )
          }}/>
          <Route exact path='/Login' history={this.props.history} render={() => {
            return <LoginContainer history={this.props.history}/>
          }}/>
          <Route exact path='/Home' history={this.props.history} render={() => {
            return <HomeContainer history={this.props.history}/>
          }}/>

          <Route exact path='/' render={() => {
            return <SearchContainer history={this.props.history}/>
          }}/>
        </Switch>
      </section>
    )
  }
}

export default App
