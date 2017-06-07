import React, {Component} from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import HomeContainer from './HomeContainer'
import CreateAccountContainer from './CreateAccountContainer'
import LoginContainer from './LoginContainer'
import NavbarContainer from './NavbarContainer'
import FavoritesContainer from './FavoritesContainer'
import SearchContainer from './SearchContainer'
import SearchNavbarContainer from './SearchNavbarContainer'

class App extends Component {
  render() {
    return (
      <section>

        <Switch>
          <Route exact path='/Favorites' render={() => {
            return (
              <section>
                <NavbarContainer history={this.props.history}/>
                <FavoritesContainer history={this.props.history}/>
              </section>
            )
          }}/>
          <Route exact path='/CreateAccount'  render={() => {
            return (
              <section>
                <NavbarContainer history={this.props.history}/>
                <CreateAccountContainer history={this.props.history}/>
              </section>
            )
          }}/>
          <Route exact path='/Login' render={() => {
            return (
              <section>
                <NavbarContainer history={this.props.history}/>
                <LoginContainer history={this.props.history}/>
              </section>
            )
          }}/>
          <Route exact path='/Home' render={() => {
            return (
              <section>
                {/* <NavbarContainer history={this.props.history}/> */}
                <HomeContainer history={this.props.history}/>
              </section>
            )
          }}/>

          <Route exact path='/' render={() => {
            return (
              <section>
                <SearchNavbarContainer history={this.props.history}/>
                <SearchContainer history={this.props.history}/>
              </section>
            )
          }}/>
        </Switch>
      </section>
    )
  }
}

export default App
