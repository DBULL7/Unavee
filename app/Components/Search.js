import React, { Component } from 'react'
import { checkDatabaseForSearch } from './Helpers/HomeHelper'



class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      scrubbedTweets: { "contentItems": []},
    }
  }

  helper() {
    checkDatabaseForSearch(this.state.search, this.setState.bind(this), this.state.scrubbedTweets, this.props.handleSearchResult.bind(this))
    this.props.history.replace('/Home')
  }


  render () {
    return (
      <article className='home-search'>
        {/* {this.displayErrorMessage()} */}
        <h1 className='home-title'>Unavee</h1>
        <div className='home-form'>
          <div className='search-bar-container'>
            <input className='home-search-bar' value={this.state.search} onChange={(e) => {this.setState({search: e.target.value})}} placeholder="Search by email"/>
          </div>
          <button id="search-button" className="button" onClick={() => this.helper()}>Search</button>
        </div>
      </article>
    )
  }
}

export default Search
